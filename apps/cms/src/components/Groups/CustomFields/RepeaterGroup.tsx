import T from "@/translations/index";
import classNames from "classnames";
import { Component, For, createMemo } from "solid-js";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Store
import builderStore, { BrickStoreGroupT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import Button from "@/components/Partials/Button";
import DragDrop from "@/components/Partials/DragDrop";

interface RepeaterGroupProps {
  data: {
    brickIndex: number;
    field: CustomFieldT;

    repeater: {
      parentGroupId: BrickStoreGroupT["parent_group_id"];
      repeaterDepth: number;
    };
  };
}

export const RepeaterGroup: Component<RepeaterGroupProps> = (props) => {
  // -------------------------------
  // Memos
  const repeaterGroups = createMemo(() => {
    const groups = builderStore.get.bricks[props.data.brickIndex].groups;

    return groups
      .filter((group) => {
        return (
          group.repeater_key === props.data.field.key &&
          group.parent_group_id === props.data.repeater.parentGroupId
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

  const repeaterKey = createMemo(() => {
    return `${props.data.field.key}-${props.data.repeater.repeaterDepth}-${props.data.repeater.parentGroupId}`;
  });

  // -------------------------------
  // Functions
  const addGroup = () => {
    if (!props.data.field.fields) return;
    builderStore.get.addGroup({
      brickIndex: props.data.brickIndex,
      fields: props.data.field.fields,

      repeaterKey: props.data.field.key,
      parentGroupId: props.data.repeater.parentGroupId || null,
      order: nextOrder(),
    });
  };
  const removeGroup = (group_id: BrickStoreGroupT["group_id"]) => {
    builderStore.get.removeGroup({
      brickIndex: props.data.brickIndex,
      groupId: group_id,
    });
  };

  // -------------------------------
  // Render
  return (
    <div class="mb-2.5 last:mb-0 w-full">
      <h3 class="text-sm text-body font-body font-normal mb-2.5">
        {props.data.field.title}
      </h3>
      {/* Group */}
      <DragDrop
        sortOrder={(index, targetindex) => {
          builderStore.get.swapGroupOrder({
            brickIndex: props.data.brickIndex,

            groupId: index,
            targetGroupId: targetindex,
          });
        }}
      >
        {({ dragDrop }) => (
          <For each={repeaterGroups()}>
            {(group) => (
              <div
                class={classNames(`w-full flex`, {
                  "opacity-60":
                    dragDrop.getDragging()?.index === group.group_id,
                })}
                data-dragkey={repeaterKey()}
                onDragStart={(e) =>
                  dragDrop.onDragStart(e, {
                    index: group.group_id,
                    key: repeaterKey(),
                  })
                }
                onDragEnd={(e) => dragDrop.onDragEnd(e)}
                onDragEnter={(e) =>
                  dragDrop.onDragEnter(e, {
                    index: group.group_id,
                    key: repeaterKey(),
                  })
                }
                onDragOver={(e) => dragDrop.onDragOver(e)}
              >
                {/* Group Items */}
                <div
                  class={classNames(
                    "bg-background border-border border mb-2.5 flex last:mb-0 rounded-md w-full duration-200 transition-colors",
                    {
                      "bg-white": props.data.repeater.repeaterDepth % 2 !== 0,
                      "border-secondary":
                        dragDrop.getDraggingTarget()?.index === group.group_id,
                    }
                  )}
                >
                  <div
                    class="w-5 h-full bg-backgroundAccent hover:bg-backgroundAccentH transition-colors duration-200 flex items-center justify-center cursor-grab"
                    onDragStart={(e) =>
                      dragDrop.onDragStart(e, {
                        index: group.group_id,
                        key: repeaterKey(),
                      })
                    }
                    onDragEnd={(e) => dragDrop.onDragEnd(e)}
                    onDragEnter={(e) =>
                      dragDrop.onDragEnter(e, {
                        index: group.group_id,
                        key: repeaterKey(),
                      })
                    }
                    onDragOver={(e) => dragDrop.onDragOver(e)}
                    draggable={true}
                  >
                    <FaSolidGripLines class="fill-title w-3" />
                  </div>
                  <div class="p-15 w-full">
                    <For each={props.data.field.fields}>
                      {(field) => (
                        <CustomFields.DynamicField
                          data={{
                            brickIndex: props.data.brickIndex,
                            field: field,
                            groupId: group.group_id,

                            repeater: {
                              parentGroupId: group.group_id,
                              repeaterDepth:
                                (props.data.repeater.repeaterDepth || 0) + 1,
                            },
                          }}
                        />
                      )}
                    </For>
                  </div>
                </div>
                {/* Group Action Bar */}
                <div class={`ml-2.5 transition-opacity duration-200`}>
                  <button
                    type="button"
                    class="fill-primary hover:fill-errorH bg-transparent transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      removeGroup(group.group_id);
                    }}
                    aria-label={T("remove_entry")}
                  >
                    <FaSolidTrashCan class="w-4" />
                  </button>
                </div>
              </div>
            )}
          </For>
        )}
      </DragDrop>
      <div>
        <Button type="button" theme="primary" size="x-small" onClick={addGroup}>
          {T("add_entry")}
        </Button>
      </div>
    </div>
  );
};
