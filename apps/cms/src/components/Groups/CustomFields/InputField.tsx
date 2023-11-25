import { Component, createSignal, createEffect } from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Components
import Form from "@/components/Groups/Form";

interface InputFieldProps {
  type: "number" | "text" | "datetime-local";
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];

    fieldError: FieldError | undefined;
    contentLanguage?: number | undefined;
  };
}

export const InputField: Component<InputFieldProps> = (props) => {
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
    switch (props.type) {
      case "number": {
        const value = field?.value as number | undefined;
        setValue(typeof value !== "number" ? "" : value.toString());
        break;
      }
      default: {
        const value = (field?.value as string | undefined) || "";
        setValue(value);
        break;
      }
    }
  });

  // -------------------------------
  // Render
  return (
    <Form.Input
      id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
      value={getValue()}
      onChange={(value) =>
        builderStore.get.updateFieldValue({
          brickIndex: props.state.brickIndex,
          key: props.state.key,
          groupId: props.state.groupId,
          contentLanguage: props.state.contentLanguage,
          value: props.type === "number" ? Number(value) : value,
        })
      }
      name={props.state.field.key}
      type={props.type}
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
