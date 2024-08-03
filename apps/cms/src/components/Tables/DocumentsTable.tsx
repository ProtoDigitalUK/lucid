import T from "@/translations";
import { type Component, type Accessor, Index, createMemo } from "solid-js";
import { FaSolidT, FaSolidCalendar, FaSolidUser } from "solid-icons/fa";
import { useParams, useNavigate } from "@solidjs/router";
import type {
	CollectionResponse,
	CFConfig,
	FieldTypes,
} from "@lucidcms/core/types";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import userStore from "@/store/userStore";
import useRowTarget from "@/hooks/useRowTarget";
import api from "@/services/api";
import contentLocaleStore from "@/store/contentLocaleStore";
import Table from "@/components/Groups/Table";
import DocumentRow from "@/components/Tables/Rows/DocumentRow";
import DeleteDocument from "@/components/Modals/Documents/DeleteDocument";
import helpers from "@/utils/helpers";
import Layout from "@/components/Groups/Layout";

interface DocumentsTableProps {
	collection: CollectionResponse;
	fieldIncludes: Accessor<CFConfig<FieldTypes>[]>;
	searchParams: ReturnType<typeof useSearchParamsLocation>;
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
							fallback: field.key,
						}),
						key: field.key,
						icon: <FaSolidUser />,
					};
				default: {
					return {
						label: helpers.getLocaleValue({
							value: field.labels.title,
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
			<Layout.PageTable
				rows={documents.data?.data.length || 0}
				meta={documents.data?.meta}
				searchParams={props.searchParams}
				state={{
					isLoading: documents.isLoading,
					isError: documents.isError,
					isSuccess: documents.isSuccess,
				}}
				options={{
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
					createEntry: () => {
						navigate(
							`/admin/collections/${collectionKey()}/create`,
						);
					},
				}}
			>
				<Table.Root
					key={`collections.document.list.${props.collection.key}`}
					rows={documents.data?.data.length || 0}
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
									contentLocale={contentLocale()}
									selected={selected[i]}
									options={{
										isSelectable,
									}}
									callbacks={{
										setSelected: setSelected,
									}}
									actions={[
										{
											label: T()("edit"),
											type: "link",
											href: `/admin/collections/${props.collection.key}/${doc().id}`,
											permission:
												userStore.get.hasPermission([
													"update_content",
												]).all,
										},
										{
											label: T()("delete"),
											type: "button",
											onClick: () => {
												rowTarget.setTargetId(doc().id);
												rowTarget.setTrigger(
													"delete",
													true,
												);
											},
											permission:
												userStore.get.hasPermission([
													"delete_content",
												]).all,
										},
									]}
								/>
							)}
						</Index>
					)}
				</Table.Root>
			</Layout.PageTable>
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
