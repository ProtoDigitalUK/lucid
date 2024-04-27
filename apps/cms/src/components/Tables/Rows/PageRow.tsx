import T from "@/translations";
import { type Component, createMemo } from "solid-js";
// Hooks
import type useRowTarget from "@/hooks/useRowTarget";
// Types
import type { TableRowProps } from "@/types/components";
import type { MultipleBuilderResT } from "@headless/types/src/multiple-builder"; // TODO: remove
import type { CollectionResponse } from "@protoheadless/core/types";
// Stores
import userStore from "@/store/userStore";
// Components
import Table from "@/components/Groups/Table";
import PageTitleCol from "@/components/Tables/Columns/PageTitleCol";
import DateCol from "@/components/Tables/Columns/DateCol";
import PillCol from "@/components/Tables/Columns/PillCol";
import AuthorCol from "@/components/Tables/Columns/AuthorCol";

interface PageRowProps extends TableRowProps {
	page: MultipleBuilderResT;
	collection: CollectionResponse;
	include: boolean[];
	rowTarget: ReturnType<typeof useRowTarget<"delete" | "update">>;
	contentLanguage?: number;
}

const PageRow: Component<PageRowProps> = (props) => {
	// ----------------------------------
	// Memos
	const titleTranslation = createMemo(() => {
		return props.page.title_translations.find(
			(translation) => translation.language_id === props.contentLanguage,
		);
	});

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
					href: `/collection/${props.collection.key}/multiple-builder/${props.page.id}`,
					permission: userStore.get.hasPermission(["update_content"])
						.all,
				},
				{
					label: T("quick_edit"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.page.id);
						props.rowTarget.setTrigger("update", true);
					},
					permission: userStore.get.hasPermission(["update_content"])
						.all,
				},
				{
					label: T("delete"),
					type: "button",
					onClick: () => {
						props.rowTarget.setTargetId(props.page.id);
						props.rowTarget.setTrigger("delete", true);
					},
					permission: userStore.get.hasPermission(["delete_content"])
						.all,
				},
			]}
		>
			<PageTitleCol
				title={titleTranslation()?.value ?? null}
				full_slug={props.page.full_slug}
				slug={props.page.slug}
				homepage={props.page.homepage}
				options={{ include: props?.include[0] }}
			/>
			<PillCol
				theme={props.page.published ? "secondary" : "warning"}
				text={props.page.published ? T("published") : T("draft")}
				options={{ include: props?.include[1] }}
			/>
			<AuthorCol
				author={props.page.author}
				options={{ include: props?.include[2] }}
			/>
			<DateCol
				date={props.page.createdAt}
				options={{ include: props?.include[3] }}
			/>
			<DateCol
				date={props.page.updated_at}
				options={{ include: props?.include[4] }}
			/>
		</Table.Tr>
	);
};

export default PageRow;
