import T from "@/translations";
import { type Component, type Accessor, Index, createMemo } from "solid-js";
import { FaSolidT, FaSolidCalendar, FaSolidUser } from "solid-icons/fa";
import { useParams } from "@solidjs/router";
import type { CollectionResponse, CustomField } from "@lucidcms/core/types";
import type useSearchParams from "@/hooks/useSearchParams";
import useRowTarget from "@/hooks/useRowTarget";
import api from "@/services/api";
import contentLanguageStore from "@/store/contentLanguageStore";
import Table from "@/components/Groups/Table";
import DocumentRow from "@/components/Tables/Rows/DocumentRow";
import DeleteDocument from "@/components/Modals/Documents/DeleteDocument";

interface DocumentsTableProps {
	collection: CollectionResponse;
	fieldIncludes: Accessor<CustomField[]>;
	searchParams: ReturnType<typeof useSearchParams>;
}

const DocumentsTable: Component<DocumentsTableProps> = (props) => {
	// ----------------------------------
	// State & Hooks
	const params = useParams();
	const rowTarget = useRowTarget({
		triggers: {
			delete: false,
		},
	});

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);
	const tableHeadColumns = createMemo(() => {
		return props.fieldIncludes().map((field) => {
			switch (field.type) {
				case "user":
					return {
						label: field.title || field.key,
						key: field.key,
						icon: <FaSolidUser />,
					};
				default: {
					return {
						label: field.title || field.key,
						key: field.key,
						icon: <FaSolidT />,
					};
				}
			}
		});
	});

	// ----------------------------------
	// Queries
	const documents = api.collections.document.useGetMultiple({
		queryParams: {
			queryString: props.searchParams.getQueryString,
			location: {
				collectionKey: collectionKey,
			},
			headers: {
				"lucid-content-lang": contentLanguage,
			},
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Mutations
	const deleteMultiple = api.collections.document.useDeleteMultiple({
		collectionName: props.collection.singular,
	});

	// ----------------------------------
	// Render
	return (
		<>
			<Table.Root
				key={`collections.document.list.${props.collection.key}`}
				rows={documents.data?.data.length || 0}
				meta={documents.data?.meta}
				searchParams={props.searchParams}
				head={[
					...tableHeadColumns(),
					{
						label: T("updated_at"),
						key: "updated_at",
						icon: <FaSolidCalendar />,
					},
				]}
				state={{
					isLoading: documents.isLoading,
					isError: documents.isError,
					isSuccess: documents.isSuccess,
				}}
				options={{
					isSelectable: true,
				}}
				callbacks={{
					deleteRows: async (selected) => {
						const ids: number[] = [];
						for (const i in selected) {
							if (selected[i] && documents.data?.data[i].id) {
								ids.push(documents.data?.data[i].id);
							}
						}
						await deleteMultiple.action.mutateAsync({
							collectionKey: collectionKey(),
							body: {
								ids: ids,
							},
						});
					},
				}}
			>
				{({ include, isSelectable, selected, setSelected }) => (
					<Index each={documents.data?.data || []}>
						{(doc, i) => (
							<DocumentRow
								index={i}
								document={doc()}
								fieldInclude={props.fieldIncludes()}
								collection={props.collection}
								include={include}
								contentLanguage={contentLanguage()}
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
			<DeleteDocument
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().delete,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("delete", state);
					},
				}}
				collection={props.collection}
			/>
		</>
	);
};

export default DocumentsTable;
