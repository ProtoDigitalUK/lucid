import slug from "slug";
import Environment from "../../db/models/Environment.js";
import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import environmentsService from "../environments/index.js";
import Config from "../Config.js";
import formatEnvironment from "../../utils/format/format-environment.js";
const checkAssignedBricks = async (assigned_bricks) => {
    const brickInstances = Config.bricks || [];
    const brickKeys = brickInstances.map((b) => b.key);
    const invalidBricks = assigned_bricks.filter((b) => !brickKeys.includes(b));
    if (invalidBricks.length > 0) {
        throw new LucidError({
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
const checkAssignedCollections = async (assigned_collections) => {
    const collectionInstances = Config.collections || [];
    const collectionKeys = collectionInstances.map((c) => c.key);
    const invalidCollections = assigned_collections.filter((c) => !collectionKeys.includes(c));
    if (invalidCollections.length > 0) {
        throw new LucidError({
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
const checkAssignedForms = async (assigned_forms) => {
    const formInstances = Config.forms || [];
    const formKeys = formInstances.map((f) => f.key);
    const invalidForms = assigned_forms.filter((f) => !formKeys.includes(f));
    if (invalidForms.length > 0) {
        throw new LucidError({
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
const upsertSingle = async (client, data) => {
    const key = data.create
        ? slug(data.data.key, { lower: true })
        : data.data.key;
    if (!data.create) {
        await service(environmentsService.getSingle, false, client)({
            key: data.data.key,
        });
    }
    else {
        await service(environmentsService.checkKeyExists, false, client)({
            key: data.data.key,
        });
    }
    if (data.data.assigned_bricks) {
        await checkAssignedBricks(data.data.assigned_bricks);
    }
    if (data.data.assigned_collections) {
        await checkAssignedCollections(data.data.assigned_collections);
    }
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
        throw new LucidError({
            type: "basic",
            name: "Environment not created",
            message: `Environment with key "${key}" could not be created`,
            status: 400,
        });
    }
    return formatEnvironment(environment);
};
export default upsertSingle;
//# sourceMappingURL=upsert-single.js.map