import { Component } from "solid-js";
// Components
import Table from "@/components/Groups/Table";

interface TextColProps {
  text?: string | number | null;
  options?: {
    include?: boolean;
  };
}

const TextCol: Component<TextColProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <Table.Td
      options={{
        include: props?.options?.include,
      }}
    >
      {props.text || "~"}
    </Table.Td>
  );
};

export default TextCol;
