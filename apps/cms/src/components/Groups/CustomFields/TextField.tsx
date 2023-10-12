import { Component, createSignal, createEffect } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";

interface TextFieldProps {
  data: {
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
  // Effects
  createEffect(() => {
    const field = brickHelpers.getField(props.data);
    const value = (field?.value as string | undefined) || "";
    setText(value);
  });

  // -------------------------------
  // Render
  return (
    <input
      class="w-full border-border border"
      type="text"
      value={getText()}
      placeholder={`${props.data.field.title} - ${props.data.groupId}`}
      onChange={(e) => {
        builderStore.get.updateFieldValue({
          ...props.data,
          value: e.target.value,
        });
      }}
    />
  );
};
