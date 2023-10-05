import T from "@translations/index.js";
import { PoolClient } from "pg";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
// Utils
import service from "@utils/app/service.js";
// Models
import {
  BrickObject,
  BrickFieldObject,
} from "@db/models/CollectionBrickNew.js";
import { EnvironmentT } from "@db/models/Environment.js";
import Media from "@db/models/Media.js";
import Page from "@db/models/Page.js";
// Internal packages
import BrickBuilder, {
  ValidationProps,
  MediaReferenceData,
  LinkReferenceData,
} from "@builders/brick-builder/index.js";
// Services
import environmentsService from "@services/environments/index.js";
import brickConfigService from "@services/brick-config/index.js";
import collectionsService from "@services/collections/index.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
import { MediaResT } from "@lucid/types/src/media.js";
import { PageT } from "@db/models/Page.js";
// Format
import formatMedia from "@utils/format/format-media.js";

// ------------------------------------
// Interfaces

interface BrickErrors {
  key: string;
  errors: Array<{
    key: string;
    message?: string;
  }>;
}

// ------------------------------------
// Utils

// validate bricks group
const validateBrickData = async (data: {
  bricks: BrickObject[];
  builderInstances: BrickBuilder[];
  environment: EnvironmentT;
  collection: CollectionResT;
  media: MediaResT[];
  pages: {
    id: PageT["id"];
  }[];
}) => {
  const errors: BrickErrors[] = [];
  let hasErrors = false;

  for (let i = 0; i < data.bricks.length; i++) {
    const brick = data.bricks[i];
    const brickErrors: BrickErrors = {
      key: brick.key,
      errors: [],
    };

    // Check if the brick instance exists
    const instance = data.builderInstances.find((b) => b.key === brick.key);
    if (!instance) {
      throw new LucidError({
        type: "basic",
        name: T("error_saving_bricks"),
        message: T("error_saving_page_brick_couldnt_find_brick_config", {
          key: brick.key,
        }),
        status: 400,
      });
    }

    // Check if the brick is permitted against the envrionment and collection
    const allowed = brickConfigService.isBrickAllowed({
      key: brick.key,
      type: brick.type,
      environment: data.environment,
      collection: data.collection,
    });
    if (!allowed.allowed) {
      throw new LucidError({
        type: "basic",
        name: T("error_saving_bricks"),
        message: T("error_saving_page_brick_not_in_collection", {
          key: brick.key,
          type: brick.type,
        }),
        status: 400,
      });
    }

    const flatFields = brick.fields || [];

    // For fields, validate them against the instance
    for (let j = 0; j < flatFields.length; j++) {
      const field = flatFields[j];

      // Set the secondary value
      let referenceData: ValidationProps["referenceData"] = undefined;

      switch (field.type) {
        case "link": {
          referenceData = {
            target: field.target,
          } as LinkReferenceData;
          break;
        }
        case "pagelink": {
          const page = data.pages.find((p) => p.id === field.value);
          if (page) {
            referenceData = {
              target: field.target,
            } as LinkReferenceData;
          }
          break;
        }
        case "media": {
          const media = data.media.find((m) => m.id === field.value);
          if (media) {
            referenceData = {
              extension: media.meta.file_extension,
              width: media.meta.width,
              height: media.meta.height,
            } as MediaReferenceData;
          }
          break;
        }
      }

      const err = instance.fieldValidation({
        key: field.key,
        value: field.value,
        type: field.type,
        referenceData,
        flatFieldConfig: instance.flatFields,
      });

      if (err.valid === false) {
        brickErrors.errors.push({
          key: errorKey(field.key, field.group),
          message: err.message,
        });
        hasErrors = true;
      }
    }

    errors.push(brickErrors);
  }

  return { errors, hasErrors };
};

const errorKey = (key: string, group_position?: number) => {
  return group_position ? `${key}[${group_position}]` : key;
};
const buildErrorObject = (brickErrors: Array<BrickErrors>) => {
  const errorObject: {
    [key: string]: {
      [key: string]: {
        code: string;
        message: string;
      };
    };
  } = {};

  brickErrors.forEach((brick, index) => {
    const brickKeyWithIndex = `${brick.key}[${index}]`;
    errorObject[brickKeyWithIndex] = {};
    brick.errors.forEach((error) => {
      const brickObj = errorObject[brickKeyWithIndex];
      brickObj[error.key] = {
        code: "invalid",
        message: error.message || "Invalid value.",
      };
    });
  });

  return errorObject;
};

const flattenAllFields = (bricks: BrickObject[]): BrickFieldObject[] => {
  return (
    bricks
      .map((brick) => {
        return brick.fields || [];
      })
      .flat() || []
  );
};

const getAllMedia = async (client: PoolClient, fields: BrickFieldObject[]) => {
  try {
    const getIDs = fields.map((field) => {
      if (field.type === "media") {
        return field.value;
      }
    });
    const ids = getIDs
      .filter((id) => id !== undefined)
      .filter(
        (value, index, self) => self.indexOf(value) === index
      ) as number[];

    const mediasRes = await Media.getMultipleByIds(client, {
      ids: ids,
    });

    if (!mediasRes) {
      return [];
    }

    return mediasRes.map((media) => formatMedia(media));
  } catch (err) {
    return [];
  }
};
const getAllPages = async (
  client: PoolClient,
  fields: BrickFieldObject[],
  environment_key: string
) => {
  try {
    const getIDs = fields.map((field) => {
      if (field.type === "pagelink") {
        return field.value;
      }
    });
    const ids = getIDs
      .filter((id) => id !== undefined)
      .filter(
        (value, index, self) => self.indexOf(value) === index
      ) as number[];

    const pages = await Page.getMultipleByIds(client, {
      ids: ids,
      environment_key: environment_key,
    });
    if (!pages) {
      return [];
    }

    return pages;
  } catch (err) {
    return [];
  }
};

// ------------------------------------
// Validate Bricks
const validateBricks = async (
  client: PoolClient,
  data: {
    type: CollectionResT["type"];
    bricks: Array<BrickObject>;
    collection_key: string;
    environment_key: string;
  }
) => {
  const flatFields = flattenAllFields(data.bricks);
  const builderInstances = brickConfigService.getBrickConfig();

  const [environment, collection, media, pages] = await Promise.all([
    environmentsService.getSingle(client, {
      key: data.environment_key,
    }),
    service(
      collectionsService.getSingle,
      false,
      client
    )({
      collection_key: data.collection_key,
      environment_key: data.environment_key,
      type: data.type,
    }),
    getAllMedia(client, flatFields),
    getAllPages(client, flatFields, data.environment_key),
  ]);

  // validate bricks
  const { errors, hasErrors } = await validateBrickData({
    bricks: data.bricks,
    builderInstances: builderInstances,
    collection: collection,
    environment: environment,
    media: media,
    pages: pages,
  });

  // If there are errors, throw them
  if (hasErrors) {
    throw new LucidError({
      type: "basic",
      name: "Validation Error",
      message: "There was an error validating your bricks.",
      status: 400,
      errors: modelErrors({
        bricks: buildErrorObject(errors),
      }),
    });
  }
};

export default validateBricks;
