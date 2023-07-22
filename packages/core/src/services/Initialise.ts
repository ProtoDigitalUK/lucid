import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service";
// Services
import userServices from "@services/users";

export interface ServiceData {}

const Initialise = async (client: PoolClient) => {
  // Check if there are any users in the database
  // If not, create a new user

  const users = await service(
    userServices.getMultiple,
    false,
    client
  )({
    query: {},
  });

  if (users.count === 0) {
    await service(
      userServices.registerSingle,
      false,
      client
    )({
      first_name: "Lucid",
      last_name: "Admin",
      email: "admin@lucid.com",
      username: "admin",
      password: "password",
      super_admin: true,
    });
  }
};

export default Initialise;
