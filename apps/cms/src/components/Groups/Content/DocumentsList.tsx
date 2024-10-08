import T from "@/translations";
import { type Component, type Accessor, Index, createMemo } from "solid-js";
import { FaSolidCalendar } from "solid-icons/fa";
import { useParams, useNavigate } from "@solidjs/router";
import type {
	CollectionResponse,
	CFConfig,
	FieldTypes,
} from "@lucidcms/core/types";
import userStore from "@/store/userStore";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import useRowTarget from "@/hooks/useRowTarget";
import api from "@/services/api";
import contentLocaleStore from "@/store/contentLocaleStore";
import Footers from "@/components/Groups/Footers";
import Layout from "@/components/Groups/Layout";
import DocumentRow from "@/components/Tables/Rows/DocumentRow";
import DeleteDocument from "@/components/Modals/Documents/DeleteDocument";
import Table from "@/components/Groups/Table";
import { tableHeadColumns } from "@/utils/document-table-helpers";

export const DocumentsList: Component<{
	state: {
		collection?: CollectionResponse;
		isLoading: boolean;
		fieldIncludes: Accessor<CFConfig<FieldTypes>[]>;
		searchParams: ReturnType<typeof useSearchParamsLocation>;
	};
}> = (props) => {
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
	const getTableHeadColumns = createMemo(() =>
		tableHeadColumns(props.state.fieldIncludes()),
	);

	// ----------------------------------
	// Queries
	const documents = api.collections.document.useGetMultiple({
		queryParams: {
			queryString: props.state.searchParams.getQueryString,
			location: {
				collectionKey: collectionKey,
			},
		},
		enabled: () => props.state.searchParams.getSettled(),
	});

	// ----------------------------------
	// Mutations
	const deleteMultiple = api.collections.document.useDeleteMultiple({
		getCollectionName: () =>
			props.state.collection?.singular || T()("collection"),
	});

	// ----------------------------------------
	// Render
	return (
		<Layout.DynamicContent
			state={{
				isError: documents.isError,
				isSuccess: documents.isSuccess,
				isEmpty: documents.data?.data.length === 0,
				searchParams: props.state.searchParams,
			}}
			slot={{
				footer: (
					<Footers.Paginated
						state={{
							searchParams: props.state.searchParams,
							meta: documents.data?.meta,
						}}
						options={{
							padding: "30",
						}}
					/>
				),
			}}
			copy={{
				noEntries: {
					title: T()("no_documents", {
						collectionMultiple: props.state.collection?.title,
					}),
					description: T()("no_documents_description", {
						collectionMultiple:
							props.state.collection?.title.toLowerCase(),
						collectionSingle:
							props.state.collection?.singular.toLowerCase(),
					}),
					button: T()("create_document", {
						collectionSingle: props.state.collection?.singular,
					}),
				},
			}}
			callback={{
				createEntry: () => {
					navigate(`/admin/collections/${collectionKey()}/create`);
				},
			}}
		>
			<Table.Root
				key={`collections.document.list.${props.state.collection?.key}`}
				rows={documents.data?.data.length || 0}
				searchParams={props.state.searchParams}
				head={[
					...getTableHeadColumns(),
					{
						label: T()("updated_at"),
						key: "updated_at",
						icon: <FaSolidCalendar />,
					},
				]}
				state={{
					isLoading: documents.isLoading || props.state.isLoading,
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
								fieldInclude={props.state.fieldIncludes()}
								collection={
									props.state.collection as CollectionResponse
								}
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
										href: `/admin/collections/${props.state.collection?.key}/${doc().id}`,
										permission: userStore.get.hasPermission(
											["update_content"],
										).all,
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
										permission: userStore.get.hasPermission(
											["delete_content"],
										).all,
									},
								]}
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
				collection={props.state.collection as CollectionResponse}
			/>
		</Layout.DynamicContent>
	);
};
