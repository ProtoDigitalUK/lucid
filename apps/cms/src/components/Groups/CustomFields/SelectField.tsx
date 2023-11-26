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

interface SelectFieldProps {
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];

    fieldError: FieldError | undefined;
    contentLanguage?: number | undefined;
  };
}

export const SelectField: Component<SelectFieldProps> = (props) => {
  // -------------------------------
  // State
  const [getValue, setValue] = createSignal<string | null>(null);

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
    const value = field?.value as string | undefined;
    setValue(value || null);
  });

  // -------------------------------
  // Render
  return (
    <Form.Select
      id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
      value={getValue() || undefined}
      options={props.state.field.options || []}
      onChange={(value) =>
        builderStore.get.updateFieldValue({
          brickIndex: props.state.brickIndex,
          key: props.state.key,
          groupId: props.state.groupId,
          contentLanguage: props.state.contentLanguage,
          value: value || null,
        })
      }
      name={props.state.field.key}
      copy={{
        label: props.state.field.title,
        describedBy: props.state.field.description,
      }}
      noClear={props.state.field.validation?.required || false}
      errors={props.state.fieldError}
      required={props.state.field.validation?.required || false}
      theme={"basic"}
    />
  );
};
