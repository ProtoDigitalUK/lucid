import T from "@/translations";
import { Component } from "solid-js";
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
				created_at: undefined,
				updated_at: "desc",
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
									label: T("sent"),
									value: "sent",
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
							label: T("created_at"),
							key: "created_at",
						},
						{
							label: T("updated_at"),
							key: "updated_at",
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
