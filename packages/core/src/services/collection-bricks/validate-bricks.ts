import { PoolClient } from "pg";
import { LucidError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import { BrickObject, BrickFieldObject } from "@db/models/CollectionBrick.js";
import { EnvironmentT } from "@db/models/Environment.js";
// Internal packages
import BrickBuilder, {
  ValidationProps,
  MediaReferenceData,
  LinkReferenceData,
} from "@builders/brick-builder/index.js";
import { CollectionBrickConfigT } from "@builders/collection-builder/index.js";
// Services
import brickConfigService from "@services/brick-config/index.js";
import pageService from "@services/pages/index.js";
import medias from "@services/media/index.js";
// Types
import { CollectionResT } from "@lucid/types/src/collections.js";
import { MediaResT } from "@lucid/types/src/media.js";
import { PageT } from "@db/models/Page.js";

// ------------------------------------
// Interfaces
interface BrickErrors {
  key: string;
  errors: Array<{
    key: string;
    message?: string;
  }>;
}

interface FlattenBricksRes {
  builder_bricks: {
    brick_key: string;
    flat_fields: BrickFieldObject[];
  }[];
  fixed_bricks: {
    brick_key: string;
    flat_fields: BrickFieldObject[];
  }[];
  flat_fields: BrickFieldObject[];
}

// ------------------------------------
// Utils
const flattenAllBricks = (
  builder_bricks: BrickObject[],
  fixed_bricks: BrickObject[]
): FlattenBricksRes => {
  if (!builder_bricks && !fixed_bricks)
    return {
      builder_bricks: [],
      fixed_bricks: [],
      flat_fields: [],
    };

  const builderBricks: FlattenBricksRes["builder_bricks"] = [];
  const fixedBricks: FlattenBricksRes["fixed_bricks"] = [];
  const flatBricks: BrickFieldObject[] = [];

  for (let brick of builder_bricks) {
    const flatFields = flattenBricksFields(brick.fields);
    builderBricks.push({
      brick_key: brick.key,
      flat_fields: flatFields,
    });
    flatBricks.push(...flatFields);
  }
  for (let brick of fixed_bricks) {
    const flatFields = flattenBricksFields(brick.fields);
    fixedBricks.push({
      brick_key: brick.key,
      flat_fields: flatFields,
    });
    flatBricks.push(...flatFields);
  }

  return {
    builder_bricks: builderBricks,
    fixed_bricks: fixedBricks,
    flat_fields: flatBricks,
  };
};

const flattenBricksFields = (
  fields?: BrickFieldObject[]
): BrickFieldObject[] => {
  let flatFields: BrickFieldObject[] = [];
  if (!fields) return flatFields;

  for (let brick of fields) {
    let flatBrick: BrickFieldObject = {
      fields_id: brick.fields_id,
      parent_repeater: brick.parent_repeater,
      key: brick.key,
      type: brick.type,
      value: brick.value,
      target: brick.target,
      group_position: brick.group_position,
    };

    Object.keys(flatBrick).forEach(
      // @ts-ignore
      (key) => flatBrick[key] === undefined && delete flatBrick[key]
    );
    flatFields.push(flatBrick);

    if (brick.items) {
      flatFields = flatFields.concat(flattenBricksFields(brick.items));
    }
  }

  return flatFields;
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

// validate bricks group
const validateBricksGroup = async (data: {
  bricks: FlattenBricksRes["builder_bricks"] | FlattenBricksRes["fixed_bricks"];
  builderInstances: BrickBuilder[];
  type: CollectionBrickConfigT["type"];
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
      key: brick.brick_key,
      errors: [],
    };

    // Check if the brick instance exists
    const instance = data.builderInstances.find(
      (b) => b.key === brick.brick_key
    );
    if (!instance) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    // Check if the brick is permitted against the envrionment and collection
    const allowed = brickConfigService.isBrickAllowed({
      key: brick.brick_key,
      type: data.type,
      environment: data.environment,
      collection: data.collection,
    });

    if (!allowed.allowed) {
      throw new LucidError({
        type: "basic",
        name: "Brick not allowed",
        message: `The brick "${brick.brick_key}" of type "${data.type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
        status: 500,
      });
    }

    const flatFields = brick.flat_fields;

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
          key: errorKey(field.key, field.group_position),
          message: err.message,
        });
        hasErrors = true;
      }
    }

    errors.push(brickErrors);
  }

  return { errors, hasErrors };
};

// Get data
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

    const media = await service(
      medias.getMultipleByIds,
      false,
      client
    )({
      ids: ids,
    });
    return media;
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

    const pages = await service(
      pageService.getMultipleById,
      false,
      client
    )({
      ids,
      environment_key,
    });
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
    builder_bricks: BrickObject[];
    fixed_bricks: BrickObject[];
    collection: CollectionResT;
    environment: EnvironmentT;
  }
) => {
  const builderInstances = brickConfigService.getBrickConfig();

  // Flatten all fields and get all media and pages
  const bricksFlattened = flattenAllBricks(
    data.builder_bricks,
    data.fixed_bricks
  );

  const pageMediaPromises = await Promise.all([
    getAllMedia(client, bricksFlattened.flat_fields),
    getAllPages(client, bricksFlattened.flat_fields, data.environment.key),
  ]);

  const media = pageMediaPromises[0];
  const pages = pageMediaPromises[1];

  // validate builder bricks
  const { errors: builderErrors, hasErrors: builderHasErrors } =
    await validateBricksGroup({
      bricks: bricksFlattened.builder_bricks,
      builderInstances: builderInstances,
      collection: data.collection,
      environment: data.environment,
      type: "builder",
      media: media,
      pages: pages,
    });

  // validate fixed bricks
  const { errors: fixedErrors, hasErrors: fixedHasErrors } =
    await validateBricksGroup({
      bricks: bricksFlattened.fixed_bricks,
      builderInstances: builderInstances,
      collection: data.collection,
      environment: data.environment,
      type: "fixed",
      media: media,
      pages: pages,
    });

  // If there are errors, throw them
  if (builderHasErrors || fixedHasErrors) {
    throw new LucidError({
      type: "basic",
      name: "Validation Error",
      message: "There was an error validating your bricks.",
      status: 400,
      errors: modelErrors({
        builder_bricks: buildErrorObject(builderErrors),
        fixed_bricks: buildErrorObject(fixedErrors),
      }),
    });
  }
};

export default validateBricks;
