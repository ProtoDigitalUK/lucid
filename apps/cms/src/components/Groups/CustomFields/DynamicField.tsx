import { Component, For, Match, Switch, Show, createMemo } from "solid-js";
import classNames from "classnames";
// Types
import type { CustomFieldT } from "@headless/types/src/bricks";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore, {
  type BrickStoreGroupT,
  type BrickStoreFieldT,
} from "@/store/builderStore";
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
  // Memos
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );

  const fieldError = createMemo(() => {
    return builderStore.get.fieldsErrors.find((field) => {
      return (
        field.key === props.state.field.key &&
        field.language_id === contentLanguage() &&
        field.group_id === props.state.groupId
      );
    });
  });

  // -------------------------------
  // Render
  return (
    <div class="w-full mb-2.5 last:mb-0 relative">
      <Show when={props.state.field.type !== "tab"}>
        <FieldTypeIcon type={props.state.field.type} />
      </Show>
      <div
        class={classNames("w-full h-full", {
          "pl-[38px]": props.state.field.type !== "tab",
        })}
      >
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
            <CustomFields.InputField
              type="text"
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "wysiwyg"}>
            <CustomFields.WYSIWYGField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "media"}>
            <CustomFields.MediaField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "number"}>
            <CustomFields.InputField
              type="number"
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "checkbox"}>
            <CustomFields.CheckboxField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "select"}>
            <CustomFields.SelectField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "textarea"}>
            <CustomFields.TextareaField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "json"}>
            <CustomFields.JSONField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "colour"}>
            <CustomFields.ColourField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "datetime"}>
            <CustomFields.InputField
              type="datetime-local"
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "pagelink"}>
            <CustomFields.PageLinkField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
          <Match when={props.state.field.type === "link"}>
            <CustomFields.LinkField
              state={{
                brickIndex: props.state.brickIndex,
                key: props.state.field.key,
                field: props.state.field,
                groupId: props.state.groupId,
                fieldError: fieldError(),
                contentLanguage: contentLanguage(),
              }}
            />
          </Match>
        </Switch>
      </div>
    </div>
  );
};
