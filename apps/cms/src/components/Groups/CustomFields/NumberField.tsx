import { Component, createSignal, createEffect, createMemo } from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Components
import Form from "@/components/Groups/Form";

interface NumberFieldProps {
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];
  };
}

export const NumberField: Component<NumberFieldProps> = (props) => {
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
    const value = field?.value as number | undefined;
    setText(typeof value !== "number" ? "" : value.toString());
  });

  // -------------------------------
  // Render
  return (
    <Form.Input
      id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
      value={getText()}
      onChange={(value) =>
        builderStore.get.updateFieldValue({
          brickIndex: props.state.brickIndex,
          key: props.state.key,
          groupId: props.state.groupId,
          contentLanguage: contentLanguage(),
          value: Number(value),
        })
      }
      name={props.state.field.key}
      type="number"
      copy={{
        label: props.state.field.title,
        placeholder: props.state.field.placeholder,
        describedBy: props.state.field.description,
      }}
      errors={fieldError()}
      required={props.state.field.validation?.required || false}
      theme={"basic"}
    />
  );
};
