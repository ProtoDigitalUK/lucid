import T from "@/translations/index";
import classNames from "classnames";
import { Component, For, createMemo } from "solid-js";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import builderStore, { BrickStoreGroupT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import Button from "@/components/Partials/Button";
import DragDrop from "@/components/Partials/DragDrop";

interface RepeaterGroupProps {
  state: {
    brickIndex: number;
    field: CustomFieldT;
    contentLanguage: number | undefined;
    fieldErrors: FieldError[];
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
    const groups = builderStore.get.bricks[props.state.brickIndex].groups;

    return groups
      .filter((group) => {
        return (
          group.repeater_key === props.state.field.key &&
          group.parent_group_id === props.state.repeater.parentGroupId &&
          group.language_id === props.state.contentLanguage
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
    return `${props.state.field.key}-${props.state.repeater.repeaterDepth}-${props.state.repeater.parentGroupId}`;
  });

  // -------------------------------
  // Functions
  const addGroup = () => {
    if (!props.state.field.fields) return;
    builderStore.get.addGroup({
      brickIndex: props.state.brickIndex,
      fields: props.state.field.fields,

      repeaterKey: props.state.field.key,
      parentGroupId: props.state.repeater.parentGroupId || null,
      order: nextOrder(),
      contentLanguage: props.state.contentLanguage,
    });
  };
  const removeGroup = (group_id: BrickStoreGroupT["group_id"]) => {
    builderStore.get.removeGroup({
      brickIndex: props.state.brickIndex,
      groupId: group_id,
    });
  };

  // -------------------------------
  // Render
  return (
    <div class="mb-2.5 last:mb-0 w-full">
      <h3 class="text-sm text-body font-body font-normal mb-2.5">
        {props.state.field.title}
      </h3>
      {/* Group */}
      <DragDrop
        sortOrder={(index, targetindex) => {
          builderStore.get.swapGroupOrder({
            brickIndex: props.state.brickIndex,

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
                      "bg-white": props.state.repeater.repeaterDepth % 2 !== 0,
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
                    <For each={props.state.field.fields}>
                      {(field) => (
                        <CustomFields.DynamicField
                          state={{
                            brickIndex: props.state.brickIndex,
                            field: field,
                            groupId: group.group_id,
                            contentLanguage: props.state.contentLanguage,
                            fieldErrors: props.state.fieldErrors,
                            repeater: {
                              parentGroupId: group.group_id,
                              repeaterDepth:
                                (props.state.repeater.repeaterDepth || 0) + 1,
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
