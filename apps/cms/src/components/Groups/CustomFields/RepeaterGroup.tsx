import T from "@/translations/index";
import classNames from "classnames";
import { Component, For, createMemo } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import Button from "@/components/Partials/Button";

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
  const fieldValues = createMemo(() => {
    const brick = builderStore.get[props.data.type][props.data.brickIndex];
    const fields = brick.fields.filter((field) => {
      if (field.repeater !== props.data.field.key) return false;

      const fieldGroup = field.group;
      const targetDepth = props.data?.depth + 1;

      if (!fieldGroup || fieldGroup.length !== targetDepth) return false;

      for (let i = 0; i < props.data.depth; i++) {
        if (fieldGroup[i] !== props.data.group[i]) return false;
      }

      return true;
    });

    return fields;
  });

  const repeaterGroups = createMemo(() => {
    const uniqueGroups = new Set<number>();

    fieldValues().forEach((field) => {
      if (!field.group) return;
      const groupIndex = field.group[props.data.depth]; // Assuming this exists
      uniqueGroups.add(groupIndex);
    });

    return uniqueGroups.size;
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
    <div class="mb-2.5 last:mb-0 w-full">
      <h3 class="text-sm text-body font-body font-normal mb-2.5">
        {props.data.field.title}
      </h3>
      {/* Group */}
      <For each={Array.from({ length: repeaterGroups() })}>
        {(_, i) => (
          <div class="w-full flex">
            {/* Group Items */}
            <div
              class={classNames(
                "bg-background border-border border p-15 mb-2.5 last:mb-0 rounded-md w-full ",
                {
                  "bg-white": props.data.depth % 2 !== 0,
                }
              )}
            >
              <For each={props.data.field.fields}>
                {(field) => (
                  <CustomFields.DynamicField
                    data={{
                      type: props.data.type,
                      brickIndex: props.data.brickIndex,
                      field: field,
                      repeater: props.data.field.key,

                      group: [...props.data.group, i()],
                      depth: props.data.depth + 1,
                    }}
                  />
                )}
              </For>
            </div>
            {/* Group Action Bar */}
            <div class="ml-2.5">
              <button type="button" class="w-5 h-5 bg-error">
                D
              </button>
            </div>
          </div>
        )}
      </For>
      <div>
        <Button type="button" theme="primary" size="x-small" onClick={addGroup}>
          {T("add_entry")}
        </Button>
      </div>
    </div>
  );
};
