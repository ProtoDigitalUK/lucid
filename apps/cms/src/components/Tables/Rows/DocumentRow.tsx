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
import brickHelpers from "@/utils/brick-helpers";
import userStore from "@/store/userStore";
import contentLocaleStore from "@/store/contentLocaleStore";
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
	contentLocale?: string;
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
					label: T()("edit"),
					type: "link",
					href: `/collections/${props.collection.key}/${props.document.id}`,
					permission: userStore.get.hasPermission(["update_content"])
						.all,
				},
				{
					label: T()("delete"),
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
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale ?? "",
	);
	const fieldData = createMemo(() => {
		return props.document.fields?.find((f) => f.key === props.field.key);
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue({
			fieldData: fieldData(),
			fieldConfig: props.field,
			contentLocale: contentLocale(),
		});
	});
	const fieldMeta = createMemo(() => {
		return brickHelpers.getFieldMeta({
			fieldData: fieldData(),
			fieldConfig: props.field,
			contentLocale: contentLocale(),
		});
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
					text={fieldValue() as string | undefined | null}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
			<Match when={fieldData()?.type === "textarea"}>
				<TextCol
					text={fieldValue() as string | undefined | null}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
			<Match when={fieldData()?.type === "checkbox"}>
				<TextCol
					text={
						(fieldValue() as 1 | 0 | undefined | null) === 1
							? "✅"
							: "❌"
					}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
			<Match when={fieldData()?.type === "user"}>
				<AuthorCol
					user={fieldMeta() as UserMeta}
					options={{ include: props?.include[props.index] }}
				/>
			</Match>
		</Switch>
	);
};

export default DocumentRow;
