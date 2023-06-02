// -------------------------------------------
// Types
type GroupGetSingle = (collection_key: string) => Promise<GroupT>;
type GroupCreateOrUpdate = (
  collection_key: string,
  bricks: any
) => Promise<GroupT>;

// -------------------------------------------
// User
export type GroupT = {
  id: number;
  collection_key: string;

  created_at: string;
  updated_at: string;
};

export default class Group {
  // -------------------------------------------
  // Methods
  static getSingle: GroupGetSingle = async (collection_key) => {
    // TODO: add lookup by by collection key and fetch brick field data

    return {} as GroupT;
  };
  static createOrUpdate: GroupCreateOrUpdate = async (
    collection_key,
    bricks
  ) => {
    // TODO: create or update the group for the collection key
    // Validate brick data and store in the database

    return {} as GroupT;
  };
  // -------------------------------------------
  // Util Methods
}
