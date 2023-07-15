import { PoolClient } from "pg";

// -------------------------------------------
// Types
type UserTokenCreateSingle = (
  client: PoolClient,
  data: {
    user_id: number;
    token_type: UserTokenT["token_type"];
    token: string;
    expiry_date: string;
  }
) => Promise<UserTokenT>;

type UserTokenGetByToken = (
  client: PoolClient,
  data: {
    token: string;
    token_type: UserTokenT["token_type"];
  }
) => Promise<UserTokenT>;

type UserTokenDeleteSingle = (
  client: PoolClient,
  data: { id: number }
) => Promise<UserTokenT>;

type UserTokenRemoveExpiredTokens = (
  client: PoolClient
) => Promise<UserTokenT[]>;

// -------------------------------------------
// User Token
export type UserTokenT = {
  id: number;
  user_id: number;
  token_type: "password_reset";
  token: string;
  created_at: string;
  expiry_date: string;
};

export default class UserToken {
  static createSingle: UserTokenCreateSingle = async (client, data) => {
    const userToken = await client.query<UserTokenT>({
      text: `
            INSERT INTO lucid_user_tokens (
                user_id,
                token_type,
                token,
                expiry_date
            ) VALUES (
                $1,
                $2,
                $3,
                $4
            ) RETURNING *
        `,
      values: [data.user_id, data.token_type, data.token, data.expiry_date],
    });

    return userToken.rows[0];
  };
  static getByToken: UserTokenGetByToken = async (client, data) => {
    const userToken = await client.query<UserTokenT>({
      text: `
            SELECT * FROM lucid_user_tokens
            WHERE token = $1
            AND token_type = $2
            AND expiry_date > NOW()
        `,
      values: [data.token, data.token_type],
    });

    return userToken.rows[0];
  };
  static deleteSingle: UserTokenDeleteSingle = async (client, data) => {
    const userToken = await client.query<UserTokenT>({
      text: `
            DELETE FROM lucid_user_tokens
            WHERE id = $1
        `,
      values: [data.id],
    });

    return userToken.rows[0];
  };
  static removeExpiredTokens: UserTokenRemoveExpiredTokens = async (client) => {
    const userToken = await client.query<UserTokenT>({
      text: `
            DELETE FROM lucid_user_tokens
            WHERE expiry_date < NOW()
        `,
    });

    return userToken.rows;
  };
}
