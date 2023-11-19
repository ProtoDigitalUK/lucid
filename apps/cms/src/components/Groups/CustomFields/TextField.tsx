import {
  Component,
  createSignal,
  createEffect,
  createMemo,
  Show,
} from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";

interface TextFieldProps {
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];
    contentLanguage: number | undefined;
    fieldErrors: FieldError[];
  };
}

export const TextField: Component<TextFieldProps> = (props) => {
  // -------------------------------
  // State
  const [getText, setText] = createSignal("");

  // -------------------------------
  // Memos
  const fieldError = createMemo(() => {
    return props.state.fieldErrors.find((field) => {
      return (
        field.key === props.state.key &&
        field.language_id === props.state.contentLanguage
      );
    });
  });

  // -------------------------------
  // Effects
  createEffect(() => {
    const field = brickHelpers.getField(props.state);
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
            ...props.state,
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
