import T from "@/translations";
import type { Component } from "solid-js";
import type useRowTarget from "@/hooks/useRowTarget";
import type { TableRowProps } from "@/types/components";
import type {
	CollectionDocumentResponse,
	CollectionResponse,
} from "@protoheadless/core/types";
import userStore from "@/store/userStore";
import Table from "@/components/Groups/Table";
import PageTitleCol from "@/components/Tables/Columns/PageTitleCol";
import DateCol from "@/components/Tables/Columns/DateCol";
import PillCol from "@/components/Tables/Columns/PillCol";
import AuthorCol from "@/components/Tables/Columns/AuthorCol";

interface DocumentRowProps extends TableRowProps {
	document: CollectionDocumentResponse;
	collection: CollectionResponse;
	include: boolean[];
	// rowTarget: ReturnType<typeof useRowTarget<"delete" | "update">>;
	contentLanguage?: number;
}

const DocumentRow: Component<DocumentRowProps> = (props) => {
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
			<DateCol
				date={props.document.updatedAt}
				options={{ include: props?.include[0] }}
			/>
		</Table.Tr>
	);
};

export default DocumentRow;
