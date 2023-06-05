import z from "zod";
import e, { Request, Response, NextFunction } from "express";
import { LucidError, modelErrors } from "@utils/error-handler";
// Models
import BrickConfig from "@db/models/BrickConfig";
import { BrickObject, BrickFieldObject } from "@db/models/BrickData";

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
    let flatBrick = {
      id: brick.id,
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

// ------------------------------------
// Validate Bricks Middleware
const validateBricks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const builderInstances = BrickConfig.getBrickConfig();
    const bodyBricks = req.body.bricks as BrickObject[];

    const errors: BrickErrors[] = [];
    let hasErrors = false;

    for (let i = 0; i < bodyBricks.length; i++) {
      const brick = bodyBricks[i];
      const brickErrors: BrickErrors = {
        key: brick.key,
        errors: [],
      };

      const instance = builderInstances.find((b) => b.key === brick.key);
      if (!instance) {
        throw new LucidError({
          type: "basic",
          name: "Brick not found",
          message: "We could not find the brick you are looking for.",
          status: 404,
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

    return next();
  } catch (error) {
    return next(error);
  }
};

export default validateBricks;
