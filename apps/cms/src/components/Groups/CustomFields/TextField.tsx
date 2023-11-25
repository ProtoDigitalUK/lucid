import {
  Component,
  createSignal,
  createEffect,
  createMemo,
  Show,
} from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";

interface TextFieldProps {
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];
  };
}

export const TextField: Component<TextFieldProps> = (props) => {
  // -------------------------------
  // State
  const [getText, setText] = createSignal("");

  // -------------------------------
  // Memos
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );

  const fieldError = createMemo(() => {
    return builderStore.get.fieldsErrors.find((field) => {
      return (
        field.key === props.state.key &&
        field.language_id === contentLanguage() &&
        field.group_id === props.state.groupId
      );
    });
  });

  // -------------------------------
  // Effects
  createEffect(() => {
    const field = brickHelpers.getField({
      brickIndex: props.state.brickIndex,
      field: props.state.field,
      groupId: props.state.groupId,
      key: props.state.key,
      contentLanguage: contentLanguage(),
    });
    const value = (field?.value as string | undefined) || "";
    setText(value);
  });

  // -------------------------------
  // Render
  return (
    <>
      <input
        class="w-full border-border border"
        type="text"
        value={getText()}
        placeholder={`${props.state.field.title} - ${props.state.groupId}`}
        onChange={(e) => {
          builderStore.get.updateFieldValue({
            brickIndex: props.state.brickIndex,
            key: props.state.key,
            groupId: props.state.groupId,
            contentLanguage: contentLanguage(),
            value: e.target.value,
          });
        }}
      />
      <Show when={fieldError()}>
        <div class="text-red-500 text-sm">{fieldError()?.message}</div>
      </Show>
    </>
  );
};
