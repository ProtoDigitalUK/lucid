import client from "@db/db";
// Utils
import { LucidError } from "@utils/error-handler";

// -------------------------------------------
// Types

// -------------------------------------------
// User
export type UserRoleT = {
  id: string;
  user_id: string;
  role_id: string;

  created_at: string;
  updated_at: string;
};

export default class UserRole {
  // -------------------------------------------
  // Functions
  // -------------------------------------------
  // Util Functions
}
