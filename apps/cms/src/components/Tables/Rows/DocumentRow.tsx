import T from "@/translations";
import { type Component, createMemo, For, Switch, Match } from "solid-js";
import type useRowTarget from "@/hooks/useRowTarget";
import type { TableRowProps } from "@/types/components";
import type {
	CollectionDocumentResponse,
	CollectionResponse,
	CustomField,
	UserMeta,
} from "@protoheadless/core/types";
import userStore from "@/store/userStore";
import Table from "@/components/Groups/Table";
import PageTitleCol from "@/components/Tables/Columns/PageTitleCol";
import DateCol from "@/components/Tables/Columns/DateCol";
import PillCol from "@/components/Tables/Columns/PillCol";
import AuthorCol from "@/components/Tables/Columns/AuthorCol";
import TextCol from "@/components/Tables/Columns/TextCol";

interface DocumentRowProps extends TableRowProps {
	document: CollectionDocumentResponse;
	collection: CollectionResponse;
	fieldInclude: CustomField[];
	include: boolean[];
	// rowTarget: ReturnType<typeof useRowTarget<"delete" | "update">>;
	contentLanguage?: number;
}

const DocumentRow: Component<DocumentRowProps> = (props) => {
	// ----------------------------------
	// Memos
	const uniqueFields = createMemo(() => {
		return props.document.fields?.filter(
			(field, index, self) =>
				index === self.findIndex((t) => t.key === field.key),
		);
	});

	const documentColumns = createMemo(() => {});

	const colStatingIndex = createMemo(() => {
		const length = uniqueFields()?.length;
		return length ? length : 0;
	});

	// ----------------------------------
	// Render
	return (
		<Table.Tr
			index={props.index}
			selected={props.selected}
			options={props.options}
			callbacks={props.callbacks}
			actions={
				[
					// {
					// 	label: T("edit"),
					// 	type: "link",
					// 	href: `/collection/${props.collection.key}/multiple-builder/${props.page.id}`,
					// 	permission: userStore.get.hasPermission(["update_content"])
					// 		.all,
					// },
					// {
					// 	label: T("quick_edit"),
					// 	type: "button",
					// 	onClick: () => {
					// 		props.rowTarget.setTargetId(props.page.id);
					// 		props.rowTarget.setTrigger("update", true);
					// 	},
					// 	permission: userStore.get.hasPermission(["update_content"])
					// 		.all,
					// },
					// {
					// 	label: T("delete"),
					// 	type: "button",
					// 	onClick: () => {
					// 		props.rowTarget.setTargetId(props.page.id);
					// 		props.rowTarget.setTrigger("delete", true);
					// 	},
					// 	permission: userStore.get.hasPermission(["delete_content"])
					// 		.all,
					// },
				]
			}
		>
			<For each={props.fieldInclude}>
				{(field, i) => {
					const documentField = props.document.fields?.find(
						(f) => f.key === field.key,
					);

					return (
						<Switch
							fallback={
								<TextCol
									text={"~"}
									options={{ include: props?.include[i()] }}
								/>
							}
						>
							<Match when={documentField?.type === "text"}>
								<TextCol
									text={
										documentField?.value as
											| string
											| undefined
											| null
									}
									options={{ include: props?.include[i()] }}
								/>
							</Match>
							<Match when={documentField?.type === "textarea"}>
								<TextCol
									text={
										documentField?.value as
											| string
											| undefined
											| null
									}
									options={{ include: props?.include[i()] }}
								/>
							</Match>
							<Match when={documentField?.type === "user"}>
								<AuthorCol
									user={documentField?.meta as UserMeta}
									options={{ include: props?.include[i()] }}
								/>
							</Match>
						</Switch>
					);
				}}
			</For>
			<DateCol
				date={props.document.updatedAt}
				options={{ include: props?.include[colStatingIndex()] }}
			/>
		</Table.Tr>
	);
};

export default DocumentRow;
