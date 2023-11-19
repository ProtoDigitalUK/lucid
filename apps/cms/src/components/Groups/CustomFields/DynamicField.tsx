import { Component, For, Match, Switch, Show, createMemo } from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import { BrickStoreGroupT, BrickStoreFieldT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import FieldTypeIcon from "@/components/Partials/FieldTypeIcon";

interface DynamicFieldProps {
  state: {
    brickIndex: number;
    field: CustomFieldT;
    activeTab?: string;
    groupId?: BrickStoreFieldT["group_id"];
    contentLanguage: number | undefined;
    fieldErrors: FieldError[];

    repeater?: {
      parentGroupId: BrickStoreGroupT["parent_group_id"];
      repeaterDepth: number;
    };
  };
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
  // -------------------------------
  // Memos
  const fieldErrors = createMemo(() => {
    return props.state.fieldErrors.filter(
      (field) => field.group_id === props.state.groupId
    );
  });

  // -------------------------------
  // Render
  return (
    <div class="flex w-full mb-2.5 last:mb-0">
      <Show when={props.state.field.type !== "tab"}>
        <FieldTypeIcon type={props.state.field.type} />
      </Show>
      <div class="w-full">
        <Switch>
          <Match when={props.state.field.type === "tab"}>
            <Show when={props.state.activeTab === props.state.field.key}>
              <For each={props.state.field.fields}>
                {(field) => (
                  <DynamicField
                    state={{
                      brickIndex: props.state.brickIndex,
                      field: field,
                      repeater: props.state.repeater,
                      contentLanguage: props.state.contentLanguage,
                      fieldErrors: fieldErrors(),
                    }}
                  />
                )}
              </For>
            </Show>
          </Match>
          <Match when={props.state.field.type === "repeater"}>
            <CustomFields.RepeaterGroup
              state={{
                brickIndex: props.state.brickIndex,
                field: props.state.field,
                contentLanguage: props.state.contentLanguage,
                fieldErrors: fieldErrors(),
                repeater: {
                  parentGroupId: props.state.repeater?.parentGroupId || null,
                  repeaterDepth: props.state.repeater?.repeaterDepth || 0,
                },
              }}
            />
          </Match>
          <Match when={props.state.field.type === "text"}>
            <CustomFields.TextField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                contentLanguage: props.state.contentLanguage,
                fieldErrors: fieldErrors(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "wysiwyg"}>
            <div>wysiwyg</div>
          </Match>
          <Match when={props.state.field.type === "media"}>
            <div>media</div>
          </Match>
          <Match when={props.state.field.type === "number"}>
            <div>number</div>
          </Match>
          <Match when={props.state.field.type === "checkbox"}>
            <div>checkbox</div>
          </Match>
          <Match when={props.state.field.type === "select"}>
            <div>select</div>
          </Match>
          <Match when={props.state.field.type === "textarea"}>
            <div>textarea</div>
          </Match>
          <Match when={props.state.field.type === "json"}>
            <div>json</div>
          </Match>
          <Match when={props.state.field.type === "colour"}>
            <div>colour</div>
          </Match>
          <Match when={props.state.field.type === "datetime"}>
            <div>datetime</div>
          </Match>
          <Match when={props.state.field.type === "pagelink"}>
            <div>pagelink</div>
          </Match>
          <Match when={props.state.field.type === "link"}>
            <div>link</div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
