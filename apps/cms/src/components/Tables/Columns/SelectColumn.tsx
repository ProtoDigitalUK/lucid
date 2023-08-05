import { Component } from "solid-js";
// Components
import Table from "@/components/Groups/Table";
import Form from "@/components/Groups/Form";

interface SelectColumnProps {
  type?: "th" | "td";
  value: boolean;
  onChange: (value: boolean) => void;
}

const SelectColumn: Component<SelectColumnProps> = (props) => {
  const Ele = props.type === "th" ? Table.Th : Table.Td;

  return (
    <Ele
      options={{
        width: 65,
      }}
    >
      <Form.Checkbox
        value={props.value}
        onChange={props.onChange}
        copy={{}}
        noMargin={true}
      />
    </Ele>
  );
};

export default SelectColumn;
