import { Component, createSignal, createEffect } from "solid-js";
// Types
import type { CustomFieldT } from "@headless/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Components
import Form from "@/components/Groups/Form";

interface JSONFieldProps {
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];

    fieldError: FieldError | undefined;
    contentLanguage?: number | undefined;
  };
}

export const JSONField: Component<JSONFieldProps> = (props) => {
  // -------------------------------
  // State
  const [getValue, setValue] = createSignal("");

  // -------------------------------
  // Effects
  createEffect(() => {
    const field = brickHelpers.getField({
      brickIndex: props.state.brickIndex,
      field: props.state.field,
      groupId: props.state.groupId,
      key: props.state.key,
      contentLanguage: props.state.contentLanguage,
    });
    const value = (field?.value as string | undefined) || "";
    setValue(JSON.stringify(value, null, 4));
  });

  // -------------------------------
  // Render
  return (
    <Form.JSONTextarea
      id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
      value={getValue()}
      onChange={(value) =>
        builderStore.get.updateFieldValue({
          brickIndex: props.state.brickIndex,
          key: props.state.key,
          groupId: props.state.groupId,
          contentLanguage: props.state.contentLanguage,
          value: JSON.parse(value),
        })
      }
      name={props.state.field.key}
      copy={{
        label: props.state.field.title,
        placeholder: props.state.field.placeholder,
        describedBy: props.state.field.description,
      }}
      errors={props.state.fieldError}
      required={props.state.field.validation?.required || false}
      theme={"basic"}
    />
  );
};
