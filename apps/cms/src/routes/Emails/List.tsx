import T from "@/translations";
import type { Component } from "solid-js";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import EmailsTable from "@/components/Tables/EmailsTable";

const EmailListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParams(
		{
			filters: {
				to_address: {
					value: "",
					type: "text",
				},
				subject: {
					value: "",
					type: "text",
				},
				template: {
					value: "",
					type: "text",
				},
				delivery_status: {
					value: "",
					type: "array",
				},
				type: {
					value: "",
					type: "array",
				},
			},
			sorts: {
				sent_count: undefined,
				error_count: undefined,
				created_at: undefined,
				last_attempt_at: "desc",
				last_success_at: undefined,
			},
		},
		{
			singleSort: true,
		},
	);

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("email_route_title")}
			description={T("email_route_description")}
			options={{
				noBorder: true,
			}}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
					filters={[
						{
							label: T("to"),
							key: "to_address",
							type: "text",
						},
						{
							label: T("subject"),
							key: "subject",
							type: "text",
						},
						{
							label: T("template"),
							key: "template",
							type: "text",
						},
						{
							label: T("status"),
							key: "delivery_status",
							type: "multi-select",
							options: [
								{
									label: T("delivered"),
									value: "delivered",
								},
								{
									label: T("failed"),
									value: "failed",
								},
								{
									label: T("pending"),
									value: "pending",
								},
							],
						},
						{
							label: T("type"),
							key: "type",
							type: "multi-select",
							options: [
								{
									label: T("internal"),
									value: "internal",
								},
								{
									label: T("external"),
									value: "external",
								},
							],
						},
					]}
					sorts={[
						{
							label: T("sent_count"),
							key: "sent_count",
						},
						{
							label: T("failed_count"),
							key: "error_count",
						},
						{
							label: T("last_attempt_at"),
							key: "last_attempt_at",
						},
						{
							label: T("last_success_at"),
							key: "last_success_at",
						},
						{
							label: T("created_at"),
							key: "created_at",
						},
					]}
					perPage={[]}
				/>
			}
		>
			<EmailsTable searchParams={searchParams} />
		</Layout.PageLayout>
	);
};

export default EmailListRoute;
