import { RuntimeError } from "@utils/error-handler";
// Models
import User from "@db/models/User";
import Option from "@db/models/Option";
import Permission from "@db/models/Permission";

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
  if (typeof res[0].option_value === "boolean" && res[0].option_value) return;

  try {
    const user = await User.register({
      email: "admin@example.com",
      username: "admin",
      password: "admin",
    });
    // Add permissions to the user
    await Permission.set(user[0].id, "admin");
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

// Run all launch steps
const launchSteps = async () => {
  try {
    await createFixOptions();
    await createInitialAdmin();
  } catch (err) {
    new RuntimeError((err as Error).message);
  }
};

export default launchSteps;
