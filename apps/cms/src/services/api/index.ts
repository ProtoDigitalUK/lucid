import auth from "./auth";
import environment from "./environment";
import brickConfig from "./brick-config";
import users from "./users";
import roles from "./roles";
import permissions from "./permissions";
import media from "./media";
import settings from "./settings";
import email from "./email";

const exportObject = {
  auth,
  environment,
  brickConfig,
  users,
  roles,
  permissions,
  media,
  settings,
  email,
};

export default exportObject;
