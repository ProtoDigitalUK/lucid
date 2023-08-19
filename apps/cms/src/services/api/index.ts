import auth from "./auth";
import environment from "./environment";
import brickConfig from "./brick-config";
import users from "./users";
import roles from "./roles";
import permissions from "./permissions";

const exportObject = {
  auth,
  environment,
  brickConfig,
  users,
  roles,
  permissions,
};

export default exportObject;
