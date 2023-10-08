import { Component, createSignal, createEffect } from "solid-js";
// Types
import { CustomFieldT } from "@lucid/types/src/bricks";
import { BrickStoreFieldT } from "@/store/builderStore";
// Utils
import brickHelpers from "@/utils/brick-helpers";

interface TextFieldProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    key: CustomFieldT["key"];
    field: CustomFieldT;
    group_id?: BrickStoreFieldT["group_id"];
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
      placeholder={`${props.data.field.title} - ${props.data.group_id}`}
      onChange={(e) => {
        brickHelpers.updateFieldValue({
          ...props.data,
          value: e.target.value,
        });
      }}
    />
  );
};
