import { Component } from "solid-js";
// Types
import { TableRowProps } from "@/types/components";
// Components
import Table from "@/components/Groups/Table";

interface UserRowProps extends TableRowProps {
  user: {
    first_name: string;
    last_name: string;
    role: string;
    favorite_color: string;
    notes: string;
    created_at: string;
    updated_at: string;
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
      actions={[
        {
          label: "Edit",
          type: "link",
          href: "/",
          permission: true,
        },
        {
          label: "Delete",
          type: "button",
          onClick: () => {
            console.log("Delete");
          },
          permission: true,
        },
      ]}
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
      <Table.Td
        options={{
          include: props?.include[5],
        }}
      >
        {props.user.created_at}
      </Table.Td>
      <Table.Td
        options={{
          include: props?.include[6],
        }}
      >
        {props.user.updated_at}
      </Table.Td>
    </Table.Tr>
  );
};

export default UserRow;
