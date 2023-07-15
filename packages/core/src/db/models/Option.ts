import { PoolClient } from "pg";

// -------------------------------------------
// Types
type OptionGetByName = (
  client: PoolClient,
  data: {
    name: OptionT["option_name"];
  }
) => Promise<OptionT>;

type OptionPatchByName = (
  client: PoolClient,
  data: {
    name: OptionT["option_name"];
    value: OptionT["option_value"];
    type: OptionT["type"];
  }
) => Promise<OptionT>;

// -------------------------------------------
// Option
export type OptionT = {
  option_name: "initial_user_created" | "media_storage_used";
  option_value: boolean | number | string | object | Array<any>;
  type: "boolean" | "string" | "number" | "json";

  created_at: string;
  updated_at: string;
};

export default class Option {
  static getByName: OptionGetByName = async (client, data) => {
    const options = await client.query<OptionT>({
      text: `SELECT * FROM lucid_options WHERE option_name = $1`,
      values: [data.name],
    });

    return options.rows[0];
  };
  static patchByName: OptionPatchByName = async (client, data) => {
    const options = await client.query<OptionT>({
      text: `UPDATE lucid_options SET option_value = $1, type = $2, updated_at = NOW() WHERE option_name = $3 RETURNING *`,
      values: [data.value, data.type, data.name],
    });

    return options.rows[0];
  };
}
