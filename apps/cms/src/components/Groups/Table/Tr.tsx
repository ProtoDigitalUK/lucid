import { Component, JSXElement, Show } from "solid-js";
// Components
import SelectColumn from "@/components/Tables/Columns/SelectColumn";
import Table from "@/components/Groups/Table";

interface TrProps extends TableRowProps {
  actions?: Array<{
    label: string;
    type: "button" | "link";
    onClick?: () => void;
    href?: string;
    permission?: boolean;
  }>;
  children: JSXElement;
}

// Table Row

export const Tr: Component<TrProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <tr class="bg-background hover:bg-backgroundAccent duration-200 transition-colors">
      <Show when={props.options?.isSelectable}>
        <SelectColumn
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
      <Table.Td
        classes={"text-right sticky right-0"}
        options={{
          noMinWidth: true,
        }}
      >
        :
      </Table.Td>
    </tr>
  );
};
