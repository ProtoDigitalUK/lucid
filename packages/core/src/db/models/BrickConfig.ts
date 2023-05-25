import { Request } from "express";
import argon2 from "argon2";
import sql from "@db/db";
import omitUndefinedKeys from "@utils/omit-undedefined-keys";
import { LucidError, modelErrors } from "@utils/error-handler";
// Internal packages
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";

// -------------------------------------------
// Types

type BrickConfigGetAll = (req: Request) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (
  req: Request,
  key: string
) => Promise<BrickConfigT>;
type BrickConfigValidData = (req: Request, data: any) => Promise<boolean>;

// -------------------------------------------
// User
export type BrickConfigT = {
  key: string;
  title: string;
  fields: CustomField[];
};

export default class BrickConfig {
  // -------------------------------------------
  // Methods
  static getSingle: BrickConfigGetSingle = async (req, key) => {
    const brickInstance = BrickConfig.getBrickConfig(req);
    if (!brickInstance) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    const brick = brickInstance.find((b) => b.key === key);
    if (!brick) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    const brickData = BrickConfig.getBrickData(brick);

    return brickData;
  };
  static getAll: BrickConfigGetAll = async (req) => {
    const brickInstance = BrickConfig.getBrickConfig(req);
    if (!brickInstance) return [];

    const bricks = await Promise.all(
      brickInstance.map((brick) => BrickConfig.getBrickData(brick))
    );

    return bricks;
  };
  // TODO: Return to this method once page builder is implemented and we need to validate single brick data
  static validData: BrickConfigValidData = async (req, data) => {
    const brickInstances = BrickConfig.getBrickConfig(req);
    if (!brickInstances) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    // Find single brick instance
    const brickInst = brickInstances.find((b) => b.key === data.key);
    if (!brickInst) {
      throw new LucidError({
        type: "basic",
        name: "Brick not found",
        message: "We could not find the brick you are looking for.",
        status: 404,
      });
    }

    // Validate data
    const validatedData = brickInst.validateBrickData(data);

    return validatedData;
  };
  // -------------------------------------------
  // Util Methods
  static getBrickConfig = (req: Request): BrickBuilderT[] => {
    const brickInstances = req.app.get("bricks") as BrickBuilderT[];
    if (!brickInstances) {
      return [];
    } else {
      return brickInstances;
    }
  };
  static getBrickData = (instance: BrickBuilderT): BrickConfigT => {
    return {
      key: instance.key,
      title: instance.title,
      fields: instance.fieldTree,
    };
  };
}
