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
				toAddress: {
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
				deliveryStatus: {
					value: "",
					type: "array",
				},
				type: {
					value: "",
					type: "array",
				},
			},
			sorts: {
				sentCount: undefined,
				errorCount: undefined,
				createdAt: undefined,
				lastAttemptAt: "desc",
				lastSuccessAt: undefined,
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
							key: "toAddress",
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
							key: "deliveryStatus",
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
							key: "sentCount",
						},
						{
							label: T("failed_count"),
							key: "errorCount",
						},
						{
							label: T("last_attempt_at"),
							key: "lastAttemptAt",
						},
						{
							label: T("last_success_at"),
							key: "lastSuccessAt",
						},
						{
							label: T("created_at"),
							key: "createdAt",
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
