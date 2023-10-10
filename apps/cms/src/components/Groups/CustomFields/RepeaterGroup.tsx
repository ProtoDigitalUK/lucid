import T from "@/translations/index";
import classNames from "classnames";
import { Component, For, createMemo } from "solid-js";
import { FaSolidGripLines } from "solid-icons/fa";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore, { BrickStoreGroupT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import Button from "@/components/Partials/Button";
import DragDropZone from "@/components/Partials/DragDropZone";

interface RepeaterGroupProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: CustomFieldT;

    repeater: {
      parent_group_id: BrickStoreGroupT["parent_group_id"];
      repeater_depth: number;
    };
  };
}

export const RepeaterGroup: Component<RepeaterGroupProps> = (props) => {
  // -------------------------------
  // Memos
  const repeaterGroups = createMemo(() => {
    const groups =
      builderStore.get[props.data.type][props.data.brickIndex].groups;

    return groups
      .filter((group) => {
        return (
          group.repeater_key === props.data.field.key &&
          group.parent_group_id === props.data.repeater.parent_group_id
        );
      })
      .sort((a, b) => a.group_order - b.group_order);
  });

  const nextOrder = createMemo(() => {
    const repGroups = repeaterGroups();
    if (!repGroups.length) return 0;
    const largestOrder = repGroups.reduce((prev, current) => {
      return prev.group_order > current.group_order ? prev : current;
    });
    return largestOrder.group_order + 1;
  });

  // -------------------------------
  // Functions
  const addGroup = () => {
    if (!props.data.field.fields) return;
    brickHelpers.addGroup({
      type: props.data.type,
      brickIndex: props.data.brickIndex,
      fields: props.data.field.fields,

      repeater_key: props.data.field.key,
      parent_group_id: props.data.repeater.parent_group_id || null,
      order: nextOrder(),
    });
  };
  const removeGroup = (group_id: BrickStoreGroupT["group_id"]) => {
    brickHelpers.removeGroup({
      type: props.data.type,
      brickIndex: props.data.brickIndex,
      group_id: group_id,
    });
  };

  const groupKey = (group: BrickStoreGroupT) => {
    return JSON.stringify(group);
  };

  // -------------------------------
  // Render
  return (
    <div class="mb-2.5 last:mb-0 w-full">
      <h3 class="text-sm text-body font-body font-normal mb-2.5">
        {props.data.field.title}
      </h3>
      {/* Group */}
      <DragDropZone
        zoneId={`repeater-${props.data.field.key}`}
        sortOrder={() => {
          //   if (index === targetIndex) console.log("same index");
          //   else console.log("different index");
        }}
        options={{
          scale: "out",
        }}
      >
        {({ dropZone }) => (
          <>
            <ul>
              <li>Dragging Index {dropZone.getDraggingIndex()}</li>
              <li>Target Index {dropZone.getDraggingOverIndex()}</li>
            </ul>
            <For each={repeaterGroups()}>
              {(group) => (
                <div
                  class={classNames("w-full flex", {
                    "opacity-60":
                      dropZone.getDraggingIndex() === groupKey(group),
                  })}
                  data-zoneId={dropZone.zoneId}
                  onDragStart={(e) => dropZone.onDragStart(e, groupKey(group))}
                  onDragEnd={(e) => dropZone.onDragEnd(e)}
                  onDragEnter={(e) => dropZone.onDragEnter(e, groupKey(group))}
                  onDragOver={(e) => dropZone.onDragOver(e)}
                >
                  {/* Group Items */}
                  <div
                    class={classNames(
                      "bg-background border-border border mb-2.5 flex last:mb-0 rounded-md w-full ",
                      {
                        "bg-white":
                          props.data.repeater.repeater_depth % 2 !== 0,
                      }
                    )}
                  >
                    <button
                      class="w-5 h-full bg-backgroundAccent hover:bg-backgroundAccentH transition-colors duration-200 flex items-center justify-center cursor-grab"
                      onDragStart={(e) =>
                        dropZone.onDragStart(e, groupKey(group))
                      }
                      onDragEnd={(e) => dropZone.onDragEnd(e)}
                      onDragEnter={(e) =>
                        dropZone.onDragEnter(e, groupKey(group))
                      }
                      onDragOver={(e) => dropZone.onDragOver(e)}
                      draggable={true}
                    >
                      <FaSolidGripLines class="fill-title w-3" />
                    </button>
                    <div class="p-15 w-full">
                      <h3 class="text-sm">{groupKey(group)}</h3>
                      <For each={props.data.field.fields}>
                        {(field) => (
                          <CustomFields.DynamicField
                            data={{
                              type: props.data.type,
                              brickIndex: props.data.brickIndex,
                              field: field,
                              group_id: group.group_id,

                              repeater: {
                                parent_group_id: group.group_id,
                                repeater_depth:
                                  (props.data.repeater.repeater_depth || 0) + 1,
                              },
                            }}
                          />
                        )}
                      </For>
                    </div>
                  </div>
                  {/* Group Action Bar */}
                  <div class="ml-2.5">
                    <button
                      type="button"
                      class="w-5 h-5 bg-error"
                      onClick={() => {
                        removeGroup(group.group_id);
                      }}
                    >
                      D
                    </button>
                  </div>
                </div>
              )}
            </For>
          </>
        )}
      </DragDropZone>
      <div>
        <Button type="button" theme="primary" size="x-small" onClick={addGroup}>
          {T("add_entry")}
        </Button>
      </div>
    </div>
  );
};
