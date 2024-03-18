import T from "@/translations";
import { Component } from "solid-js";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
// Types
import { TableRowProps } from "@/types/components";
import { RoleResT } from "@headless/types/src/roles";
// Store
import userStore from "@/store/userStore";
// Components
import Table from "@/components/Groups/Table";
import TextCol from "@/components/Tables/Columns/TextCol";
import DateCol from "../Columns/DateCol";

interface RoleRowProps extends TableRowProps {
	role: RoleResT;
	include: boolean[];
	rowTarget: ReturnType<typeof useRowTarget<"update" | "delete">>;
}

const RoleRow: Component<RoleRowProps> = (props) => {
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
						props.rowTarget.setTargetId(props.role.id);
						props.rowTarget.setTrigger("update", true);
					},
					permission: userStore.get.hasPermission(["update_role"])
						.all,
				},
				{
					label: T("delete"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.role.id);
						props.rowTarget.setTrigger("delete", true);
					},
					permission: userStore.get.hasPermission(["delete_role"])
						.all,
				},
			]}
			options={props.options}
			callbacks={props.callbacks}
		>
			<TextCol
				text={props.role.name}
				options={{ include: props?.include[0] }}
			/>
			<DateCol
				date={props.role.created_at}
				options={{ include: props?.include[1] }}
			/>
			<DateCol
				date={props.role.updated_at}
				options={{ include: props?.include[2] }}
			/>
		</Table.Tr>
	);
};

export default RoleRow;
