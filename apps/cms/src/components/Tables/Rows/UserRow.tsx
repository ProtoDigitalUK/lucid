import { Component } from "solid-js";
// Types
import { TableRowProps } from "@/types/components";
import { UserResT } from "@lucid/types/src/users";
// Components
import Table from "@/components/Groups/Table";

interface UserRowProps extends TableRowProps {
  user: UserResT;
  include: boolean[];
}

const UserRow: Component<UserRowProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <Table.Tr
      index={props.index}
      selected={props.selected}
      actions={[]}
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
        {props.user.email}
      </Table.Td>
      <Table.Td
        options={{
          include: props?.include[3],
        }}
      >
        {props.user.created_at}
      </Table.Td>
    </Table.Tr>
  );
};

export default UserRow;
