import {
  PermissionGroup,
  PermissionsResT,
} from "@lucid/types/src/permissions.js";

const formatPermissions = (
  permissions: Record<string, PermissionGroup>
): PermissionsResT => {
  return {
    global: [
      permissions.users,
      permissions.roles,
      permissions.media,
      permissions.settings,
      permissions.environment,
      permissions.emails,
      permissions.languages,
    ],
    environment: [
      permissions.content,
      permissions.category,
      permissions.menu,
      permissions.form_submissions,
    ],
  };
};

export default formatPermissions;
