import T from "@/translations/index";
import classNames from "classnames";
import {
  Component,
  For,
  createMemo,
  createSignal,
  createEffect,
} from "solid-js";
import { FaSolidGripLines } from "solid-icons/fa";
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
  // New signal for stored groups
  const [storedGroups, setStoredGroups] = createSignal<
    { group: number; group_order: number }[]
  >([]);

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
    // Create a mapping for group_order to group
    const groupOrderMap: Map<number, number> = new Map();

    fieldValues().forEach((field) => {
      if (!field.group) return;
      const groupIndex = field.group[props.data.depth]; // Assuming this exists
      const groupOrder = field.group_order || 0; // Replace with actual field property for group_order
      groupOrderMap.set(groupIndex, groupOrder);
    });

    // Sort based on group_order and create an array of objects containing group and group_order
    const sortedGroups = Array.from(groupOrderMap.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([group, group_order]) => ({ group, group_order }));

    return sortedGroups || [];
  });

  // -------------------------------
  // Effect to update storedGroups
  createEffect(() => {
    const newGroups = repeaterGroups();
    if (newGroups.length > storedGroups().length) {
      setStoredGroups([
        ...storedGroups(),
        ...newGroups.slice(storedGroups().length),
      ]);
    }
  });

  const incrementedGroup = createMemo(() => {
    const group = props.data.group || [];
    group[props.data.depth] = repeaterGroups().length;
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
        group_order: repeaterGroups().length,
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
      <For each={storedGroups()}>
        {(group) => (
          <SingleGroup
            data={props.data}
            group={group.group}
            group_order={group.group_order}
          />
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

interface SingleGroupProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: CustomFieldT;
    depth: number;
    group: number[];
  };
  group: number;
  group_order: number;
}

const SingleGroup: Component<SingleGroupProps> = (props) => {
  // console.log("group rerender");

  // -------------------------------
  return (
    <div class="w-full flex">
      {/* Group Items */}
      <div
        class={classNames(
          "bg-background border-border border p-15 mb-2.5 last:mb-0 rounded-md w-full relative",
          {
            "bg-white": props.data.depth % 2 !== 0,
          }
        )}
      >
        <button
          type="button"
          class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-6 h-10 flex items-center justify-center border-border border bg-backgroundAccent rounded-l-md"
        >
          <FaSolidGripLines class="fill-body w-3" />
        </button>
        {props.group_order}
        <For each={props.data.field.fields}>
          {(field) => (
            <CustomFields.DynamicField
              data={{
                type: props.data.type,
                brickIndex: props.data.brickIndex,
                field: field,
                repeater: props.data.field.key,

                group: [...props.data.group, props.group],
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
  );
};
