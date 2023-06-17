import { RuntimeError } from "@utils/error-handler";
// Models
import Config from "@db/models/Config";
import Environment from "@db/models/Environment";
import User from "@db/models/User";
import Option from "@db/models/Option";
import Permission from "@db/models/Permission";

/*
    Lucid stores an options table in the database to control certain aspects of the application,
     if they are not set or become out of sync, we can use this to fix them.
*/
const createFixOptions = async () => {
  // this is only created if the option doesnt exist, if it does it will already be true and locked
  await Option.create({
    name: "initial_user_created",
    value: true,
    type: "boolean",
    locked: true,
  });
};

/* 
    Depending on if the initial admin user exists or not, we will create it. 
    We will also lock, or resync the option value inline with the user creation.
*/
const createInitialAdmin = async () => {
  const res = await Option.getByName("initial_user_created");
  if (typeof res.option_value === "boolean" && res.option_value) return;

  try {
    const user = await User.register({
      email: "admin@example.com",
      username: "admin",
      password: "admin",
    });
    // Add permissions to the user
    await Permission.set(user.id, "admin");
    await Option.patchByName({
      name: "initial_user_created",
      value: true,
      type: "boolean",
      locked: true, // we lock it so people can't change it by accident
    });
  } catch (err) {
    await Option.patchByName({
      name: "initial_user_created",
      value: true,
      type: "boolean",
      locked: true, // we lock it so people can't change it by accident
    });
  }
};

/*
    Sync the environments from the lucid.config.ts file with the database.
*/
const syncEnvironments = async () => {
  const syncPromise = [];
  const environments = Config.environments;
  for (const env of environments) {
    syncPromise.push(
      Environment.upsertSingle({
        key: env.key,
        title: env.title,
      })
    );
  }
  await Promise.all(syncPromise);
};

// Run all launch steps
const launchSteps = async () => {
  try {
    await createFixOptions();
    await createInitialAdmin();
    await syncEnvironments();
  } catch (err) {
    new RuntimeError((err as Error).message);
  }
};

export default launchSteps;
