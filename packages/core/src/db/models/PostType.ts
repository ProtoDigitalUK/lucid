import sql from "@db/db";
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

    const postTypes = await sql<PostTypeT[]>`
        SELECT * FROM lucid_post_types WHERE key in ${sql([returnKeys])}
        `;

    return postTypes;
  };
  static createOrUpdate: PostTypeCreateOrUpdate = async (postType) => {
    const [res]: [PostTypeT?] = await sql`
        INSERT INTO lucid_post_types (key, name, singular_name)
        VALUES (${postType.key}, ${postType.name}, ${postType.singular_name})
        ON CONFLICT (key) DO UPDATE SET name = ${postType.name}, singular_name = ${postType.singular_name}
        RETURNING *
        `;
    if (!res) {
      throw new LucidError({
        type: "basic",
        name: "Post Type Error",
        message: "There was an error creating the post type.",
        status: 500,
      });
    }

    return res;
  };
  // -------------------------------------------
  // Util Methods
}
