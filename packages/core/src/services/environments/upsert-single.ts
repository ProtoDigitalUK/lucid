import { PoolClient } from "pg";
import slug from "slug";
// Models
import Environment from "@db/models/Environment.js";
// Utils
import { HeadlessError, modelErrors } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import environmentsService from "@services/environments/index.js";
import Config from "@services/Config.js";
// Format
import formatEnvironment from "@utils/format/format-environment.js";

export interface ServiceData {
  data: {
    key: string;
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
  };
  create: boolean;
}

const checkAssignedBricks = async (assigned_bricks: string[]) => {
  const brickInstances = Config.bricks || [];
  const brickKeys = brickInstances.map((b) => b.key);

  const invalidBricks = assigned_bricks.filter((b) => !brickKeys.includes(b));
  if (invalidBricks.length > 0) {
    throw new HeadlessError({
      type: "basic",
      name: "Invalid brick keys",
      message: `Make sure all assigned_bricks are valid.`,
      status: 400,
      errors: modelErrors({
        assigned_bricks: {
          code: "invalid",
          message: `Make sure all assigned_bricks are valid.`,
          children: invalidBricks.map((b) => ({
            code: "invalid",
            message: `Brick with key "${b}" not found.`,
          })),
        },
      }),
    });
  }
};
const checkAssignedCollections = async (assigned_collections: string[]) => {
  const collectionInstances = Config.collections || [];
  const collectionKeys = collectionInstances.map((c) => c.key);

  const invalidCollections = assigned_collections.filter(
    (c) => !collectionKeys.includes(c)
  );
  if (invalidCollections.length > 0) {
    throw new HeadlessError({
      type: "basic",
      name: "Invalid collection keys",
      message: `Make sure all assigned_collections are valid.`,
      status: 400,
      errors: modelErrors({
        assigned_collections: {
          code: "invalid",
          message: `Make sure all assigned_collections are valid.`,
          children: invalidCollections.map((c) => ({
            code: "invalid",
            message: `Collection with key "${c}" not found.`,
          })),
        },
      }),
    });
  }
};
const checkAssignedForms = async (assigned_forms: string[]) => {
  const formInstances = Config.forms || [];
  const formKeys = formInstances.map((f) => f.key);

  const invalidForms = assigned_forms.filter((f) => !formKeys.includes(f));
  if (invalidForms.length > 0) {
    throw new HeadlessError({
      type: "basic",
      name: "Invalid form keys",
      message: `Make sure all assigned_forms are valid.`,
      status: 400,
      errors: modelErrors({
        assigned_forms: {
          code: "invalid",
          message: `Make sure all assigned_forms are valid.`,
          children: invalidForms.map((f) => ({
            code: "invalid",
            message: `Form with key "${f}" not found.`,
          })),
        },
      }),
    });
  }
};

const upsertSingle = async (client: PoolClient, data: ServiceData) => {
  const key = data.create
    ? slug(data.data.key, { lower: true })
    : data.data.key;

  // if create false, check if environment exists
  if (!data.create) {
    await service(
      environmentsService.getSingle,
      false,
      client
    )({
      key: data.data.key,
    });
  } else {
    await service(
      environmentsService.checkKeyExists,
      false,
      client
    )({
      key: data.data.key,
    });
  }

  // Check assigned_brick keys against
  if (data.data.assigned_bricks) {
    await checkAssignedBricks(data.data.assigned_bricks);
  }

  // Check assigned_collection keys against
  if (data.data.assigned_collections) {
    await checkAssignedCollections(data.data.assigned_collections);
  }

  // Check assigned_form keys against
  if (data.data.assigned_forms) {
    await checkAssignedForms(data.data.assigned_forms);
  }

  const environment = await Environment.upsertSingle(client, {
    key,
    title: data.data.title,
    assigned_bricks: data.data.assigned_bricks,
    assigned_collections: data.data.assigned_collections,
    assigned_forms: data.data.assigned_forms,
  });

  if (!environment) {
    throw new HeadlessError({
      type: "basic",
      name: "Environment not created",
      message: `Environment with key "${key}" could not be created`,
      status: 400,
    });
  }

  return formatEnvironment(environment);
};

export default upsertSingle;
