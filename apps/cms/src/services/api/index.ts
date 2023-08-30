import auth from "./auth";
import environment from "./environment";
import brickConfig from "./brick-config";
import users from "./users";
import roles from "./roles";
import permissions from "./permissions";
import media from "./media";

const exportObject = {
  auth,
  environment,
  brickConfig,
  users,
  roles,
  permissions,
  media,
};

export default exportObject;
