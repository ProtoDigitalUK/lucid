import client from "@db/db";
import { LucidError } from "@utils/error-handler";

// -------------------------------------------
// Types

// -------------------------------------------
// User
export type RoleEnvironmentT = {
  id: string;
  role_id: string;
  environment_key: string;

  created_at: string;
  updated_at: string;
};

export default class RoleEnvironment {
  // -------------------------------------------
  // Functions
  // -------------------------------------------
  // Util Functions
}
