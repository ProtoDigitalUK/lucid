import { Component, createSignal, onCleanup } from "solid-js";
// Utils
import brickHelpers from "@/utils/brick-helpers";

interface TextFieldProps {
  data: {
    type: "builderBricks" | "fixedBricks";
    brickIndex: number;
    field: {
      key: string;
    };
  };
  callbacks: {
    onChange: (_value: string) => void;
  };
}

export const TextField: Component<TextFieldProps> = (props) => {
  // -------------------------------
  // State
  const [getValue, setValue] = createSignal<string>(
    (brickHelpers.getFieldValue({
      type: props.data.type,
      index: props.data.brickIndex,
      key: props.data.field.key,
    }) as string | undefined) || ""
  );

  // -------------------------------
  // Effects
  onCleanup(() => {
    props.callbacks.onChange(getValue());
  });

  // -------------------------------
  // Render
  return (
    <input
      class="w-full border-border border"
      type="text"
      value={getValue()}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
