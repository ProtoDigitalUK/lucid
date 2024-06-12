import T from "@/translations";
import { type Component, type Accessor, Index, createMemo } from "solid-js";
import { FaSolidT, FaSolidCalendar, FaSolidUser } from "solid-icons/fa";
import { useParams, useNavigate } from "@solidjs/router";
import type {
	CollectionResponse,
	CFConfig,
	FieldTypes,
} from "@lucidcms/core/types";
import type useSearchParams from "@/hooks/useSearchParams";
import useRowTarget from "@/hooks/useRowTarget";
import api from "@/services/api";
import contentLocaleStore from "@/store/contentLocaleStore";
import Table from "@/components/Groups/Table";
import DocumentRow from "@/components/Tables/Rows/DocumentRow";
import DeleteDocument from "@/components/Modals/Documents/DeleteDocument";
import helpers from "@/utils/helpers";

interface DocumentsTableProps {
	collection: CollectionResponse;
	fieldIncludes: Accessor<CFConfig<FieldTypes>[]>;
	searchParams: ReturnType<typeof useSearchParams>;
}

const DocumentsTable: Component<DocumentsTableProps> = (props) => {
	// ----------------------------------
	// State & Hooks
	const navigate = useNavigate();
	const params = useParams();
	const rowTarget = useRowTarget({
		triggers: {
			delete: false,
		},
	});

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale ?? "",
	);
	const tableHeadColumns = createMemo(() => {
		return props.fieldIncludes().map((field) => {
			switch (field.type) {
				case "user":
					return {
						label: helpers.getLocaleValue({
							value: field.labels.title,
							locale: contentLocale(),
							fallback: field.key,
						}),
						key: field.key,
						icon: <FaSolidUser />,
					};
				default: {
					return {
						label: helpers.getLocaleValue({
							value: field.labels.title,
							locale: contentLocale(),
							fallback: field.key,
						}),
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
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Mutations
	const deleteMultiple = api.collections.document.useDeleteMultiple({
		getCollectionName: () => props.collection.singular || T()("collection"),
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
						label: T()("updated_at"),
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
					showNoEntries: true,
				}}
				copy={{
					noEntryTitle: T()("no_documents", {
						collectionMultiple: props.collection.title,
					}),
					noEntryDescription: T()("no_documents_description", {
						collectionMultiple:
							props.collection.title.toLowerCase(),
						collectionSingle:
							props.collection.singular.toLowerCase(),
					}),
					noEntryButton: T()("create_document", {
						collectionSingle: props.collection.singular,
					}),
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
					createEntry: () => {
						navigate(
							`/admin/collections/${collectionKey()}/create`,
						);
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
								contentLocale={contentLocale()}
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
