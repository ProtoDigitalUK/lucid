import { Component } from "solid-js";
// Components
import Table from "@/components/Groups/Table";

interface UserRowProps {
  data: {
    user: {
      first_name: string;
      last_name: string;
      role: string;
      favorite_color: string;
      notes: string;
    };
    include: boolean[];
  };
}

const UserRow: Component<UserRowProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <>
      <Table.Td
        options={{
          include: props.data.include[0],
        }}
      >
        {props.data.user.first_name}
      </Table.Td>
      <Table.Td
        options={{
          include: props.data.include[1],
        }}
      >
        {props.data.user.last_name}
      </Table.Td>
      <Table.Td
        options={{
          include: props.data.include[2],
        }}
      >
        {props.data.user.role}
      </Table.Td>
      <Table.Td
        options={{
          include: props.data.include[3],
        }}
      >
        {props.data.user.favorite_color}
      </Table.Td>
      <Table.Td
        options={{
          include: props.data.include[4],
        }}
      >
        {props.data.user.notes}
      </Table.Td>
    </>
  );
};

export default UserRow;
