import T from "@/translations";
import { type Component, For, Switch, Match } from "solid-js";
import type useRowTarget from "@/hooks/useRowTarget";
import type { TableRowProps } from "@/types/components";
import type {
	CollectionDocumentResponse,
	CollectionResponse,
	CustomField,
	UserMeta,
} from "@lucidcms/core/types";
import userStore from "@/store/userStore";
import Table from "@/components/Groups/Table";
import DateCol from "@/components/Tables/Columns/DateCol";
import AuthorCol from "@/components/Tables/Columns/AuthorCol";
import TextCol from "@/components/Tables/Columns/TextCol";

interface DocumentRowProps extends TableRowProps {
	document: CollectionDocumentResponse;
	collection: CollectionResponse;
	fieldInclude: CustomField[];
	include: boolean[];
	rowTarget: ReturnType<typeof useRowTarget<"delete">>;
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
			actions={[
				{
					label: T("edit"),
					type: "link",
					href: `/collections/${props.collection.key}/${props.document.id}`,
					permission: userStore.get.hasPermission(["update_content"])
						.all,
				},
				{
					label: T("delete"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.document.id);
						props.rowTarget.setTrigger("delete", true);
					},
					permission: userStore.get.hasPermission(["delete_content"])
						.all,
				},
			]}
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
				options={{ include: props?.include[props.fieldInclude.length] }}
			/>
		</Table.Tr>
	);
};

export default DocumentRow;
