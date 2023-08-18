import { Component } from "solid-js";
// Types
import { TableRowProps } from "@/types/components";
import { UserResT } from "@lucid/types/src/users";
// Components
import Table from "@/components/Groups/Table";
import TextCol from "@/components/Tables/Columns/TextCol";
import DateCol from "../Columns/DateCol";

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
      actions={[
        {
          label: "Edit",
          type: "link",
          href: `/users/${props.user.id}`,
        },
      ]}
      options={props.options}
      callbacks={props.callbacks}
    >
      <TextCol
        text={props.user.username}
        options={{ include: props?.include[1] }}
      />
      <TextCol
        text={props.user.first_name}
        options={{ include: props?.include[2] }}
      />
      <TextCol
        text={props.user.last_name}
        options={{ include: props?.include[3] }}
      />
      <TextCol
        text={props.user.email}
        options={{ include: props?.include[4] }}
      />
      <DateCol
        date={props.user.created_at}
        options={{ include: props?.include[5] }}
      />
    </Table.Tr>
  );
};

export default UserRow;
