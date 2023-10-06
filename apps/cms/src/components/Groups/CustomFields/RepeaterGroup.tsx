import { Component, For, createMemo } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore from "@/store/builderStore";

// Components
import CustomFields from "@/components/Groups/CustomFields";

interface RepeaterGroupProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: CustomFieldT;
    depth: number;
    group: number[];
  };
}

export const RepeaterGroup: Component<RepeaterGroupProps> = (props) => {
  // -------------------------------
  // Memos
  const repeaterGroups = createMemo(() => {
    const brick = builderStore.get[props.data.type][props.data.brickIndex];
    const fieldValues = brick.fields.filter((field) => {
      // First check if the field belongs to the same repeater
      if (field.repeater !== props.data.field.key) {
        return false;
      }

      // Ensure field.group exists and has the right length
      if (!field.group || field.group.length !== props.data?.depth + 1) {
        return false;
      }

      // Now check that the field.group values match up to props.data.depth
      for (let i = 0; i < props.data.depth; i++) {
        if (field.group[i] !== props.data.group[i]) {
          return false;
        }
      }

      return true;
    });

    const groupNumbers = fieldValues
      .map((field) => field.group)
      .filter((group) => group !== undefined)
      .filter((group, index, self) => self.indexOf(group) === index);

    return groupNumbers.length || 0;
  });

  const incrementedGroup = createMemo(() => {
    const group = props.data.group || [];
    group[props.data.depth] = repeaterGroups();
    return group;
  });

  // -------------------------------
  // Functions
  const addGroup = () => {
    if (!props.data.field.fields) return;
    for (const field of props.data.field.fields) {
      if (field.type === "repeater") continue;

      brickHelpers.addField({
        type: props.data.type,
        brickIndex: props.data.brickIndex,
        field: field,
        group: incrementedGroup(),
        repeater: props.data.field.key,
      });
    }
  };

  // -------------------------------
  // Render
  return (
    <div class="">
      <h3>{props.data.field.title}</h3>
      <For each={Array.from(Array(repeaterGroups()))}>
        {(_, i) => (
          <div class="mb-10 border-y border-border bg-white">
            <h4>Group {JSON.stringify([...props.data.group, i()])}</h4>
            <For each={props.data.field.fields}>
              {(field) => (
                <CustomFields.DynamicField
                  data={{
                    type: props.data.type,
                    brickIndex: props.data.brickIndex,
                    field: field,
                    repeater: props.data.field.key,

                    group: [...props.data.group, i()], // only used on repeater fields
                    depth: props.data.depth + 1,
                  }}
                />
              )}
            </For>
          </div>
        )}
      </For>
      <button onClick={addGroup}>Add Item</button>
    </div>
  );
};
