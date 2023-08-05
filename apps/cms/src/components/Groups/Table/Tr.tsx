import { Component, JSXElement, Show } from "solid-js";
// Components
import SelectCol from "@/components/Tables/Columns/SelectCol";
import ActionMenuCol, {
  ActionMenuColProps,
} from "@/components/Tables/Columns/ActionMenuCol";

interface TrProps extends TableRowProps {
  actions?: ActionMenuColProps["actions"];
  children: JSXElement;
}

// Table Row

export const Tr: Component<TrProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <tr class="bg-background hover:bg-backgroundAccent duration-200 transition-colors">
      <Show when={props.options?.isSelectable}>
        <SelectCol
          type={"td"}
          value={props?.selected || false}
          onChange={() => {
            if (props.callbacks?.setSelected && props?.index !== undefined) {
              props.callbacks.setSelected(props?.index);
            }
          }}
        />
      </Show>
      {props.children}
      <ActionMenuCol actions={props.actions || []} />
    </tr>
  );
};
