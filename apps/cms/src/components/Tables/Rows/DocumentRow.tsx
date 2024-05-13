import T from "@/translations";
import { type Component, For, Switch, Match, createMemo } from "solid-js";
import type useRowTarget from "@/hooks/useRowTarget";
import type { TableRowProps } from "@/types/components";
import type {
	CollectionDocumentResponse,
	CollectionResponse,
	CustomField,
	UserMeta,
} from "@lucidcms/core/types";
import userStore from "@/store/userStore";
import contentLanguageStore from "@/store/contentLanguageStore";
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
	contentLanguage?: string;
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
				{(field, i) => (
					<DocumentDynamicColumns
						field={field}
						document={props.document}
						include={props.include}
						index={i()}
					/>
				)}
			</For>
			<DateCol
				date={props.document.updatedAt}
				options={{ include: props?.include[props.fieldInclude.length] }}
			/>
		</Table.Tr>
	);
};

const DocumentDynamicColumns: Component<{
	field: CustomField;
	document: CollectionDocumentResponse;
	include: boolean[];
	index: number;
}> = (props) => {
	// ----------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage ?? 1,
	);
	const fieldData = createMemo(() => {
		return props.document.fields?.find((f) => f.key === props.field.key);
	});
	const translationValue = createMemo(() => {
		return fieldData()?.translations?.[contentLanguage()];
	});

	// ----------------------------------
	// Render
	return (
		<Switch
			fallback={
				<TextCol
					text={"~"}
					options={{ include: props?.include[props.index] }}
				/>
			}
		>
			<Match when={fieldData()?.type === "text"}>
				<TextCol
					text={translationValue() as string | undefined | null}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
			<Match when={fieldData()?.type === "textarea"}>
				<TextCol
					text={translationValue() as string | undefined | null}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
			<Match when={fieldData()?.type === "checkbox"}>
				<TextCol
					text={
						(translationValue() as 1 | 0 | undefined | null) === 1
							? "✅"
							: "❌"
					}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
			<Match when={fieldData()?.type === "user"}>
				<AuthorCol
					user={fieldData()?.meta as UserMeta}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
		</Switch>
	);
};

export default DocumentRow;
