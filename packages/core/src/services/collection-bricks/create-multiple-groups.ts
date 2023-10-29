import { PoolClient } from "pg";
// Models
import CollectionBrick, {
  BrickObject,
  GroupObject,
} from "@db/models/CollectionBrick.js";

export interface ServiceData {
  bricks: Array<BrickObject>;
  language_id: number;
}

const updateGroupIds = (
  groupBatch: GroupObject[],
  refToIdMap: Record<string, number>
) => {
  for (const group of groupBatch) {
    if (refToIdMap[group.parent_group_id!]) {
      group.parent_group_id = refToIdMap[group.parent_group_id!];
    }
  }
};

const prepareGroupBatch = (
  groups: GroupObject[],
  parentId: string | null | undefined = null
): GroupObject[] => {
  if (parentId === null || parentId === undefined) {
    return groups.filter(
      (group) =>
        group.parent_group_id === null || group.parent_group_id === undefined
    );
  }
  return groups.filter((group) => group.parent_group_id === parentId);
};

const createMultipleGroups = async (client: PoolClient, data: ServiceData) => {
  const newGroups: {
    group_id: number;
    ref: string;
  }[] = [];
  let refToIdMap: Record<string, number> = {};

  const allGroups = data.bricks
    .map((brick) => {
      const groups =
        brick.groups?.map((group) => {
          return {
            ...group,
            collection_brick_id: brick.id,
          };
        }) || [];
      return groups;
    })
    .flat();
  const needCreating: GroupObject[] = allGroups.filter(
    (group) =>
      typeof group.group_id === "string" && group.group_id.startsWith("ref-")
  );

  const recursiveGroupInsert = async (
    groups: GroupObject[],
    parentId: string | null | undefined = null
  ) => {
    const groupBatch = prepareGroupBatch(groups, parentId);
    if (groupBatch.length === 0) return;

    updateGroupIds(groupBatch, refToIdMap);

    const insertedGroups = await CollectionBrick.createMultipleGroups(client, {
      groups: groupBatch,
      language_id: data.language_id,
    });

    for (const insertedGroup of insertedGroups) {
      refToIdMap[insertedGroup.ref] = insertedGroup.group_id;
    }

    newGroups.push(...insertedGroups);

    // Recursive call to insert children
    for (const insertedGroup of insertedGroups) {
      await recursiveGroupInsert(groups, insertedGroup.ref);
    }
  };

  await recursiveGroupInsert(needCreating);

  return newGroups;
};

export default createMultipleGroups;
