import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
import {
  LucidError,
  modelErrors,
  type FieldErrors,
} from "@utils/app/error-handler.js";
// Models
import { BrickObject, BrickFieldObject } from "@db/models/CollectionBrick.js";
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
import type { PageLinkValueT, LinkValueT } from "@lucid/types/src/bricks.js";
import type { CollectionResT } from "@lucid/types/src/collections.js";
import type { MediaResT } from "@lucid/types/src/media.js";
import type { PageT } from "@db/models/Page.js";
// Format
import formatMedia from "@utils/format/format-media.js";

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
  const errors: FieldErrors[] = [];
  let hasErrors = false;

  for (let i = 0; i < data.bricks.length; i++) {
    const brick = data.bricks[i];

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
          const value = field.value as LinkValueT;
          referenceData = {
            target: value?.target,
            label: value?.label,
          } as LinkReferenceData;
          break;
        }
        case "pagelink": {
          const value = field.value as PageLinkValueT;
          const page = data.pages.find((p) => p.id === value.id);
          if (page) {
            referenceData = {
              target: value?.target,
              label: value?.label,
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
        errors.push({
          key: field.key,
          brick_id: brick.id,
          language_id: field.language_id,
          group_id: field.group_id,
          message: err.message || "Invalid value.",
        });
        hasErrors = true;
      }
    }
  }

  return { errors, hasErrors };
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
        const value = field.value as PageLinkValueT;
        return value?.id;
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
        fields: errors,
      }),
    });
  }
};

export default validateBricks;
