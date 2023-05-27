import { RuntimeError } from "@utils/error-handler";
// Models
import User from "@db/models/User";
import Option from "@db/models/Option";
import Permission from "@db/models/Permission";
import PostType from "@db/models/PostType";
import Config from "@db/models/Config";

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
    Store config post types in the database, remove duplicates from config and add new page type
*/
const createPostTypes = async () => {
  const allPostTypes = [
    {
      key: "page",
      name: "Pages",
      singularName: "Page",
    },
    ...Config.postTypes,
  ];

  const uniqueKeys = new Set();

  uniqueKeys.add("page"); // out default page type
  allPostTypes.forEach((type) => {
    uniqueKeys.add(type.key);
  });

  Array.from(uniqueKeys).forEach((key) => {
    const configType = allPostTypes.find((type) => type.key === key);
    if (!configType) return;

    PostType.createOrUpdate({
      key: configType.key,
      name: configType.name,
      singular_name: configType.singularName,
    });
  });
};

// Run all launch steps
const launchSteps = async () => {
  try {
    await createFixOptions();
    await createInitialAdmin();
    await createPostTypes();
  } catch (err) {
    new RuntimeError((err as Error).message);
  }
};

export default launchSteps;
