import client from "@db/db";
import { LucidError } from "@utils/error-handler";
// Models
import Config from "./Config";

// -------------------------------------------
// Types
type PostTypeGetAll = () => Promise<PostTypeT[]>;
type PostTypeCreateOrUpdate = (postType: PostTypeT) => Promise<PostTypeT>;

// -------------------------------------------
// User
export type PostTypeT = {
  id?: number;
  key: string;
  name: string;
  singular_name: string;
};

export default class PostType {
  // -------------------------------------------
  // Methods
  static getAll: PostTypeGetAll = async () => {
    const configPostTypes = Config.postTypes;
    const returnKeys = [
      "page",
      ...configPostTypes.map((postType) => postType.key),
    ];

    const postTypes = await client.query<PostTypeT>({
      text: `SELECT * FROM lucid_post_types WHERE key = ANY($1)`,
      values: [returnKeys],
    });

    return postTypes.rows;
  };
  static createOrUpdate: PostTypeCreateOrUpdate = async (postType) => {
    const res = await client.query<PostTypeT>({
      text: `INSERT INTO lucid_post_types (key, name, singular_name)
          VALUES ($1, $2, $3)
          ON CONFLICT (key) DO UPDATE SET name = $2, singular_name = $3
          RETURNING *`,
      values: [postType.key, postType.name, postType.singular_name],
    });

    if (!res.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Post Type Error",
        message: "There was an error creating the post type.",
        status: 500,
      });
    }

    return res.rows[0];
  };
  // -------------------------------------------
  // Util Methods
}
