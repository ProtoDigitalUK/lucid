// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import CollectionBrick from "@db/models/CollectionBrick";

export interface ServiceData {
  brick_id: number;
  key: string;
  type: string;
  parent_repeater?: number;
  group_position?: number;

  create: boolean;
}

const checkFieldExists = async (data: ServiceData) => {
  const repeaterExists = await CollectionBrick.checkFieldExists({
    brick_id: data.brick_id,
    key: data.key,
    type: data.type,
    parent_repeater: data.parent_repeater,
    group_position: data.group_position,
  });

  // If the repeater exists and we are trying to create it, or if the repeater does not exist and we are trying to update it, throw an error
  if (!repeaterExists && !data.create) {
    throw new LucidError({
      type: "basic",
      name: "Field Not Found",
      message: `The field cannot be updated because it does not exist.`,
      status: 409,
    });
  } else if (repeaterExists && data.create) {
    throw new LucidError({
      type: "basic",
      name: "Field Already Exists",
      message: `The field cannot be created because it already exists.`,
      status: 409,
    });
  }
};

export default checkFieldExists;
