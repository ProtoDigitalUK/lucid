import T from "@/translations";
import type { Component } from "solid-js";
import type { TableRowProps } from "@/types/components";
import type { UserResponse } from "@lucidcms/core/types";
import userStore from "@/store/userStore";
import type useRowTarget from "@/hooks/useRowTarget";
import Table from "@/components/Groups/Table";
import TextCol from "@/components/Tables/Columns/TextCol";
import DateCol from "../Columns/DateCol";

interface UserRowProps extends TableRowProps {
	user: UserResponse;
	include: boolean[];
	rowTarget: ReturnType<
		typeof useRowTarget<"update" | "delete" | "passwordReset">
	>;
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
					label: T()("edit"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.user.id);
						props.rowTarget.setTrigger("update", true);
					},
					permission: userStore.get.hasPermission(["update_user"])
						.all,
				},
				{
					label: T()("delete"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.user.id);
						props.rowTarget.setTrigger("delete", true);
					},
					permission: userStore.get.hasPermission(["delete_user"])
						.all,
				},
				{
					label: T()("reset_password"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.user.id);
						props.rowTarget.setTrigger("passwordReset", true);
					},
					permission: userStore.get.hasPermission(["update_user"])
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
				text={props.user.firstName}
				options={{ include: props?.include[1] }}
			/>
			<TextCol
				text={props.user.lastName}
				options={{ include: props?.include[2] }}
			/>
			<TextCol
				text={props.user.superAdmin ? T()("yes") : T()("no")}
				options={{ include: props?.include[3] }}
			/>
			<TextCol
				text={props.user.email}
				options={{ include: props?.include[4] }}
			/>
			<DateCol
				date={props.user.createdAt}
				options={{ include: props?.include[5] }}
			/>
		</Table.Tr>
	);
};

export default UserRow;
