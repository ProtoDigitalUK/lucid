import { Component, JSXElement, Show } from "solid-js";
// Components
import SelectColumn from "@/components/Tables/Columns/SelectColumn";

interface TrProps {
  options?: {
    isSelectable?: boolean;
  };
  data?: {
    index: number;
    selected?: boolean;
  };
  callbacks?: {
    setSelected: (i: number) => void;
  };
  children: JSXElement;
}

export const Tr: Component<TrProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <tr>
      <Show when={props.options?.isSelectable}>
        <SelectColumn
          type={"td"}
          value={props.data?.selected || false}
          onChange={() => {
            if (
              props.callbacks?.setSelected &&
              props.data?.index !== undefined
            ) {
              props.callbacks.setSelected(props?.data.index);
            }
          }}
        />
      </Show>
      {props.children}
    </tr>
  );
};
