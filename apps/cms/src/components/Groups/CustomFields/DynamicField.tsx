import { Component, For, Match, Switch, Show } from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
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

    repeater?: {
      parentGroupId: BrickStoreGroupT["parent_group_id"];
      repeaterDepth: number;
    };
  };
}

export const DynamicField: Component<DynamicFieldProps> = (props) => {
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
                    }}
                  />
                )}
              </For>
            </Show>
          </Match>
          <Match when={props.state.field.type === "repeater"}>
            <CustomFields.RepeaterField
              state={{
                brickIndex: props.state.brickIndex,
                field: props.state.field,
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
            <CustomFields.NumberField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
              }}
            />
          </Match>
          <Match when={props.state.field.type === "checkbox"}>
            <div>checkbox</div>
          </Match>
          <Match when={props.state.field.type === "select"}>
            <div>select</div>
          </Match>
          <Match when={props.state.field.type === "textarea"}>
            <CustomFields.TextareaField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
              }}
            />
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
