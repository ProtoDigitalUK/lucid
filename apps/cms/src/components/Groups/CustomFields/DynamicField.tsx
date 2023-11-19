import { Component, For, Match, Switch, Show } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Store
import { BrickStoreGroupT, BrickStoreFieldT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";
import FieldTypeIcon from "@/components/Partials/FieldTypeIcon";

interface DynamicFieldProps {
  data: {
    brickIndex: number;
    field: CustomFieldT;
    activeTab?: string;
    groupId?: BrickStoreFieldT["group_id"];
    contentLanguage: number | undefined;

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
      <Show when={props.data.field.type !== "tab"}>
        <FieldTypeIcon type={props.data.field.type} />
      </Show>
      <div class="w-full">
        <Switch>
          <Match when={props.data.field.type === "tab"}>
            <Show when={props.data.activeTab === props.data.field.key}>
              <For each={props.data.field.fields}>
                {(field) => (
                  <DynamicField
                    data={{
                      brickIndex: props.data.brickIndex,
                      field: field,
                      repeater: props.data.repeater,
                      contentLanguage: props.data.contentLanguage,
                    }}
                  />
                )}
              </For>
            </Show>
          </Match>
          <Match when={props.data.field.type === "repeater"}>
            <CustomFields.RepeaterGroup
              data={{
                brickIndex: props.data.brickIndex,
                field: props.data.field,
                contentLanguage: props.data.contentLanguage,
                repeater: {
                  parentGroupId: props.data.repeater?.parentGroupId || null,
                  repeaterDepth: props.data.repeater?.repeaterDepth || 0,
                },
              }}
            />
          </Match>
          <Match when={props.data.field.type === "text"}>
            <CustomFields.TextField
              data={{
                brickIndex: props.data.brickIndex,
                key: props.data.field.key,
                field: props.data.field,
                groupId: props.data.groupId,
                contentLanguage: props.data.contentLanguage,
              }}
            />
          </Match>
          <Match when={props.data.field.type === "wysiwyg"}>
            <div>wysiwyg</div>
          </Match>
          <Match when={props.data.field.type === "media"}>
            <div>media</div>
          </Match>
          <Match when={props.data.field.type === "number"}>
            <div>number</div>
          </Match>
          <Match when={props.data.field.type === "checkbox"}>
            <div>checkbox</div>
          </Match>
          <Match when={props.data.field.type === "select"}>
            <div>select</div>
          </Match>
          <Match when={props.data.field.type === "textarea"}>
            <div>textarea</div>
          </Match>
          <Match when={props.data.field.type === "json"}>
            <div>json</div>
          </Match>
          <Match when={props.data.field.type === "colour"}>
            <div>colour</div>
          </Match>
          <Match when={props.data.field.type === "datetime"}>
            <div>datetime</div>
          </Match>
          <Match when={props.data.field.type === "pagelink"}>
            <div>pagelink</div>
          </Match>
          <Match when={props.data.field.type === "link"}>
            <div>link</div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
