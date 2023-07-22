// Models
import { EnvironmentT } from "@db/models/Environment";
import { EnvironmentResT } from "@lucid/types/src/environments";

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
