import { Request, Response, NextFunction } from "express";
import { LucidError, modelErrors } from "@utils/error-handler";
// Models
import BrickConfig from "@db/models/BrickConfig";
import { BrickObject, BrickFieldObject } from "@db/models/CollectionBrick";
import { EnvironmentT } from "@db/models/Environment";
import { CollectionT } from "@db/models/Collection";
// Internal packages
import BrickBuilder from "@lucid/brick-builder";
import { CollectionBrickConfigT } from "@lucid/collection-builder";

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
  bricks: BrickObject[];
  builderInstances: BrickBuilder[];
  type: CollectionBrickConfigT["type"];
  environment: EnvironmentT;
  collection: CollectionT;
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
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    // Check if the brick is permitted against the envrionment and collection
    const allowed = BrickConfig.isBrickAllowed({
      key: brick.key,
      type: data.type,
      environment: data.environment,
      collection: data.collection,
    });

    if (!allowed.allowed) {
      throw new LucidError({
        type: "basic",
        name: "Brick not allowed",
        message: `The brick "${brick.key}" of type "${data.type}" is not allowed in this collection. Check your assigned bricks in the collection and environment.`,
        status: 500,
      });
    }

    const flatFields = flattenBricksFields(brick.fields);

    // For fields, validate them against the instance
    for (let j = 0; j < flatFields.length; j++) {
      const field = flatFields[j];

      // Set the secondary value
      let secondaryValue: any = undefined;
      switch (field.type) {
        case "link": {
          secondaryValue = field.target;
          break;
        }
        case "pagelink": {
          secondaryValue = field.target;
          break;
        }
      }

      const err = instance.fieldValidation({
        key: field.key,
        value: field.value,
        type: field.type,
        secondaryValue,
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

// ------------------------------------
// Validate Bricks
const validateBricks = async (data: {
  builder_bricks: BrickObject[];
  fixed_bricks: BrickObject[];
  collection: CollectionT;
  environment: EnvironmentT;
}) => {
  const builderInstances = BrickConfig.getBrickConfig();

  // validate builder bricks
  const { errors: builderErrors, hasErrors: builderHasErrors } =
    await validateBricksGroup({
      bricks: data.builder_bricks,
      builderInstances: builderInstances,
      collection: data.collection,
      environment: data.environment,
      type: "builder",
    });

  // validate fixed bricks
  const { errors: fixedErrors, hasErrors: fixedHasErrors } =
    await validateBricksGroup({
      bricks: data.fixed_bricks,
      builderInstances: builderInstances,
      collection: data.collection,
      environment: data.environment,
      type: "fixed",
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
