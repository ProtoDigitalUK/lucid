import T from "@/translations";
import type { Component } from "solid-js";
// Hooks
import type useRowTarget from "@/hooks/useRowTarget";
// Types
import type { TableRowProps } from "@/types/components";
import type { EmailResT } from "@headless/types/src/email";
// Stores
import userStore from "@/store/userStore";
// Components
import Table from "@/components/Groups/Table";
import TextCol from "@/components/Tables/Columns/TextCol";
import DateCol from "@/components/Tables/Columns/DateCol";
import PillCol from "@/components/Tables/Columns/PillCol";

interface EmailRowProps extends TableRowProps {
	email: EmailResT;
	include: boolean[];
	rowTarget: ReturnType<typeof useRowTarget<"preview" | "resend" | "delete">>;
}

const EmailRow: Component<EmailRowProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<Table.Tr
			index={props.index}
			selected={props.selected}
			options={props.options}
			callbacks={props.callbacks}
			actions={[
				{
					label: T("preview"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.email.id);
						props.rowTarget.setTrigger("preview", true);
					},
					permission: userStore.get.hasPermission(["read_email"]).all,
				},
				{
					label: T("resend"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.email.id);
						props.rowTarget.setTrigger("resend", true);
					},
					permission: userStore.get.hasPermission(["send_email"]).all,
				},
				{
					label: T("delete"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.email.id);
						props.rowTarget.setTrigger("delete", true);
					},
					permission: userStore.get.hasPermission(["delete_email"])
						.all,
				},
			]}
		>
			<PillCol
				text={props.email.delivery_status}
				theme={
					props.email.delivery_status === "sent"
						? "green"
						: props.email.delivery_status === "failed"
						  ? "red"
						  : "grey"
				}
				options={{ include: props?.include[0] }}
			/>
			<TextCol
				text={props.email.mail_details.subject}
				options={{ include: props?.include[1], maxLines: 2 }}
			/>
			<PillCol
				text={props.email.mail_details.template}
				options={{ include: props?.include[2] }}
			/>
			<TextCol
				text={props.email.mail_details.to}
				options={{ include: props?.include[3], maxLines: 1 }}
			/>
			<TextCol
				text={props.email.mail_details.from.address}
				options={{ include: props?.include[4], maxLines: 1 }}
			/>
			<PillCol
				text={props.email.sent_count || 0}
				theme={"green"}
				options={{ include: props?.include[5] }}
			/>
			<PillCol
				text={props.email.error_count || 0}
				theme={"red"}
				options={{ include: props?.include[6] }}
			/>
			<PillCol
				text={props.email.type}
				theme={"grey"}
				options={{ include: props?.include[7] }}
			/>
			<DateCol
				date={props.email.created_at}
				options={{ include: props?.include[8] }}
			/>
			<DateCol
				date={props.email.last_attempt_at}
				options={{ include: props?.include[9] }}
			/>
			<DateCol
				date={props.email.last_success_at}
				options={{ include: props?.include[10] }}
			/>
		</Table.Tr>
	);
};

export default EmailRow;
