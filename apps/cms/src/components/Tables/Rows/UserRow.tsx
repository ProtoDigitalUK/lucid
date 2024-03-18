import T from "@/translations";
import { Component } from "solid-js";
// Types
import { TableRowProps } from "@/types/components";
import { UserResT } from "@headless/types/src/users";
// Store
import userStore from "@/store/userStore";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
// Components
import Table from "@/components/Groups/Table";
import TextCol from "@/components/Tables/Columns/TextCol";
import DateCol from "../Columns/DateCol";

interface UserRowProps extends TableRowProps {
	user: UserResT;
	include: boolean[];
	rowTarget: ReturnType<typeof useRowTarget<"update" | "delete">>;
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
					label: T("edit"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.user.id);
						props.rowTarget.setTrigger("update", true);
					},
					permission: userStore.get.hasPermission(["update_user"])
						.all,
				},
				{
					label: T("delete"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.user.id);
						props.rowTarget.setTrigger("delete", true);
					},
					permission: userStore.get.hasPermission(["delete_user"])
						.all,
				},
			]}
			options={props.options}
			callbacks={props.callbacks}
		>
			<TextCol
				text={props.user.username}
				options={{ include: props?.include[0] }}
			/>
			<TextCol
				text={props.user.first_name}
				options={{ include: props?.include[1] }}
			/>
			<TextCol
				text={props.user.last_name}
				options={{ include: props?.include[2] }}
			/>
			<TextCol
				text={props.user.super_admin ? T("yes") : T("no")}
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
