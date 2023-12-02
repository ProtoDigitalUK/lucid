// Models
import { EnvironmentT } from "@db/models/Environment.js";
import { EnvironmentResT } from "@headless/types/src/environments.js";

const formatEnvironment = (environment: EnvironmentT): EnvironmentResT => {
  return {
    key: environment.key,
    title: environment.title || "",
    assigned_bricks: environment.assigned_bricks || [],
    assigned_collections: environment.assigned_collections || [],
    assigned_forms: environment.assigned_forms || [],
  };
};

export default formatEnvironment;
