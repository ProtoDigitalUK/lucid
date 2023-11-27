import { Component } from "solid-js";
// Types
import type { CustomFieldT } from "@lucid/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import { BrickStoreFieldT } from "@/store/builderStore";
// Components
import Form from "@/components/Groups/Form";

interface MediaFieldProps {
  state: {
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    groupId?: BrickStoreFieldT["group_id"];

    fieldError: FieldError | undefined;
    contentLanguage?: number | undefined;
  };
}

export const MediaField: Component<MediaFieldProps> = (props) => {
  // -------------------------------
  // Render
  return (
    <>
      <Form.MediaSelect
        id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
        copy={{
          label: props.state.field.title,
          describedBy: props.state.field.description,
        }}
        errors={props.state.fieldError}
        required={props.state.field.validation?.required || false}
      />
    </>
  );
};
