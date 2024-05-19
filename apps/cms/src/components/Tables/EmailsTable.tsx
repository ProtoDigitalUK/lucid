import T from "@/translations";
import { type Component, Index } from "solid-js";
import {
	FaSolidT,
	FaSolidCalendar,
	FaSolidPaperPlane,
	FaSolidEnvelope,
} from "solid-icons/fa";
import api from "@/services/api";
import useRowTarget from "@/hooks/useRowTarget";
import type useSearchParams from "@/hooks/useSearchParams";
import Table from "@/components/Groups/Table";
import EmailRow from "@/components/Tables/Rows/EmailRow";
import PreviewEmailPanel from "../Panels/Email/PreviewEmailPanel";
import DeleteEmail from "@/components/Modals/Email/DeleteEmail";
import ResendEmail from "@/components/Modals/Email/ResendEmail";

interface EmailsTableProps {
	searchParams: ReturnType<typeof useSearchParams>;
}

const EmailsTable: Component<EmailsTableProps> = (props) => {
	// ----------------------------------
	// Hooks
	const rowTarget = useRowTarget({
		triggers: {
			preview: false,
			delete: false,
			resend: false,
		},
	});

	// ----------------------------------
	// Queries
	const emails = api.email.useGetMultiple({
		queryParams: {
			queryString: props.searchParams.getQueryString,
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Render
	return (
		<>
			<Table.Root
				key={"emails.list"}
				rows={emails.data?.data.length || 0}
				meta={emails.data?.meta}
				searchParams={props.searchParams}
				head={[
					{
						label: T()("status"),
						key: "status",
						icon: <FaSolidT />,
					},
					{
						label: T()("subject"),
						key: "subject",
						icon: <FaSolidT />,
					},
					{
						label: T()("template"),
						key: "template",
						icon: <FaSolidT />,
					},
					{
						label: T()("to"),
						key: "to",
						icon: <FaSolidEnvelope />,
					},
					{
						label: T()("from"),
						key: "from",
						icon: <FaSolidEnvelope />,
					},
					{
						label: T()("sent_count"),
						key: "sentCount",
						icon: <FaSolidPaperPlane />,
						sortable: true,
					},
					{
						label: T()("failed_count"),
						key: "errorCount",
						icon: <FaSolidPaperPlane />,
						sortable: true,
					},
					{
						label: T()("type"),
						key: "type",
						icon: <FaSolidT />,
					},
					{
						label: T()("first_attempt"),
						key: "createdAt",
						icon: <FaSolidCalendar />,
						sortable: true,
					},
					{
						label: T()("last_attempt"),
						key: "lastAttemptAt",
						icon: <FaSolidCalendar />,
						sortable: true,
					},
					{
						label: T()("last_success_at"),
						key: "lastSuccessAt",
						icon: <FaSolidCalendar />,
						sortable: true,
					},
				]}
				state={{
					isLoading: emails.isLoading,
					isError: emails.isError,
					isSuccess: emails.isSuccess,
				}}
				options={{
					isSelectable: false,
				}}
			>
				{({ include, isSelectable, selected, setSelected }) => (
					<Index each={emails.data?.data || []}>
						{(email, i) => (
							<EmailRow
								index={i}
								email={email()}
								include={include}
								selected={selected[i]}
								rowTarget={rowTarget}
								options={{
									isSelectable,
								}}
								callbacks={{
									setSelected: setSelected,
								}}
							/>
						)}
					</Index>
				)}
			</Table.Root>
			<PreviewEmailPanel
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().preview,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("preview", state);
					},
				}}
			/>
			<DeleteEmail
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().delete,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("delete", state);
					},
				}}
			/>
			<ResendEmail
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().resend,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("resend", state);
					},
				}}
			/>
		</>
	);
};

export default EmailsTable;
