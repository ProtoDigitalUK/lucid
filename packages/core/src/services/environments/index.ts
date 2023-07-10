// Services
import deleteSingle from "./delete-single";
import getSingle from "./get-single";
import getAll from "./get-all";
import migrateEnvironment from "./migrate-environment";
import upsertSingle from "./upsert-single";
import format from "./format";

// ----------------------------------
// Types
export interface EnvironmentResT {
  key: string;
  title: string;
  assigned_bricks: string[];
  assigned_collections: string[];
  assigned_forms: string[];
}

// ----------------------------------
// Exports
export default {
  deleteSingle,
  getSingle,
  getAll,
  migrateEnvironment,
  upsertSingle,
  format,
};
