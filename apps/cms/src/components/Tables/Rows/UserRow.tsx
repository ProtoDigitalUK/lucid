import { Component } from "solid-js";
// Components
import Table from "@/components/Groups/Table";

interface UserRowProps extends TableRowProps {
  user: {
    first_name: string;
    last_name: string;
    role: string;
    favorite_color: string;
    notes: string;
  };
  include: boolean[];
}

const UserRow: Component<UserRowProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <Table.Tr
      index={props.index}
      selected={props.selected}
      options={props.options}
      callbacks={props.callbacks}
    >
      <Table.Td
        options={{
          include: props?.include[0],
        }}
      >
        {props.user.first_name}
      </Table.Td>
      <Table.Td
        options={{
          include: props?.include[1],
        }}
      >
        {props.user.last_name}
      </Table.Td>
      <Table.Td
        options={{
          include: props?.include[2],
        }}
      >
        {props.user.role}
      </Table.Td>
      <Table.Td
        options={{
          include: props?.include[3],
        }}
      >
        {props.user.favorite_color}
      </Table.Td>
      <Table.Td
        options={{
          include: props?.include[4],
        }}
      >
        {props.user.notes}
      </Table.Td>
    </Table.Tr>
  );
};

export default UserRow;
