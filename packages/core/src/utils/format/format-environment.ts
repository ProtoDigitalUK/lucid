// Models
import { EnvironmentT } from "@db/models/Environment";

// ----------------------------------
// Types
export interface EnvironmentResT {
  key: string;
  title: string;
  assigned_bricks: string[];
  assigned_collections: string[];
  assigned_forms: string[];
}

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
