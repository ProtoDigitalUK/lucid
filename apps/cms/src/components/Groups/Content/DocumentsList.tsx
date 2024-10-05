import T from "@/translations";
import {
	type Component,
	type Accessor,
	Index,
	createMemo,
	createSignal,
} from "solid-js";
import { FaSolidCalendar, FaSolidSatelliteDish } from "solid-icons/fa";
import { useParams, useNavigate } from "@solidjs/router";
import type {
	CollectionResponse,
	CFConfig,
	FieldTypes,
	DocumentVersionType,
} from "@lucidcms/core/types";
import userStore from "@/store/userStore";
import { getDocumentRoute } from "@/utils/route-helpers";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import useRowTarget from "@/hooks/useRowTarget";
import api from "@/services/api";
import contentLocaleStore from "@/store/contentLocaleStore";
import Footers from "@/components/Groups/Footers";
import Layout from "@/components/Groups/Layout";
import DocumentRow from "@/components/Tables/Rows/DocumentRow";
import DeleteDocument from "@/components/Modals/Documents/DeleteDocument";
import PromoteToDraft from "@/components/Modals/Documents/PromoteToDraft";
import Table from "@/components/Groups/Table";
import { tableHeadColumns } from "@/utils/document-table-helpers";

export const DocumentsList: Component<{
	state: {
		collection?: CollectionResponse;
		isLoading: boolean;
		fieldIncludes: Accessor<CFConfig<FieldTypes>[]>;
		collectionIsSuccess: Accessor<boolean>;
		searchParams: ReturnType<typeof useSearchParamsLocation>;
		status: Accessor<Exclude<DocumentVersionType, "revision">>;
	};
}> = (props) => {
	// ----------------------------------
	// State & Hooks
	const navigate = useNavigate();
	const params = useParams();
	const rowTarget = useRowTarget({
		triggers: {
			delete: false,
			promote: false,
		},
	});
	const [getDocumentId, setDocumentId] = createSignal<number>();
	const [getPublishedVersionId, setPublishedVersionId] = createSignal<number>();

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale ?? "",
	);
	const getTableHeadColumns = createMemo(() =>
		tableHeadColumns(props.state.fieldIncludes()),
	);
	const documentQueryEnabled = createMemo(
		() =>
			props.state.searchParams.getSettled() === true &&
			props.state.collectionIsSuccess() === true,
	);

	// ----------------------------------
	// Queries
	const documents = api.collections.document.useGetMultiple({
		queryParams: {
			queryString: props.state.searchParams.getQueryString,
			location: {
				collectionKey: collectionKey,
				versionType: props.state.status,
			},
		},
		enabled: () => documentQueryEnabled(),
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
						collectionMultiple: props.state.collection?.title.toLowerCase(),
						collectionSingle: props.state.collection?.singular.toLowerCase(),
					}),
					button: T()("create_document", {
						collectionSingle: props.state.collection?.singular,
					}),
				},
			}}
			callback={{
				createEntry: () => {
					navigate(
						getDocumentRoute("create", {
							collectionKey: collectionKey(),
							useDrafts: props.state.collection?.useDrafts,
						}),
					);
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
						label: T()("status"),
						key: "status",
						icon: <FaSolidSatelliteDish />,
					},
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
								collection={props.state.collection as CollectionResponse}
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
										type: "button",
										onClick: () => {
											if (props.state.status() === "published") {
												// use drafts are enabled, but there is no draft version for this document
												if (
													props.state.collection?.useDrafts &&
													typeof doc().version?.draft?.id !== "number"
												) {
													// show promote to draft dialog
													setPublishedVersionId(doc().versionId as number);
													setDocumentId(doc().id);
													rowTarget.setTargetId(doc().id);
													rowTarget.setTrigger("promote", true);
													return;
												}
											}
											navigate(
												getDocumentRoute("edit", {
													collectionKey: props.state.collection?.key as string,
													useDrafts: props.state.collection?.useDrafts,
													documentId: doc().id,
													statusOverride: props.state.status(),
												}),
											);
										},
										permission: userStore.get.hasPermission([
											"update_content",
											"publish_content",
										]).all,
									},
									{
										label: T()("delete"),
										type: "button",
										onClick: () => {
											rowTarget.setTargetId(doc().id);
											rowTarget.setTrigger("delete", true);
										},
										permission: userStore.get.hasPermission(["delete_content"])
											.all,
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
			<PromoteToDraft
				id={rowTarget.getTargetId}
				publishedVersionId={getPublishedVersionId}
				collection={props.state.collection as CollectionResponse}
				state={{
					open: rowTarget.getTriggers().promote,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("promote", state);
					},
				}}
				callbacks={{
					onSuccess: () => {
						navigate(
							getDocumentRoute("edit", {
								collectionKey: props.state.collection?.key as string,
								useDrafts: props.state.collection?.useDrafts,
								documentId: getDocumentId(),
								statusOverride: "draft",
							}),
						);
					},
				}}
			/>
		</Layout.DynamicContent>
	);
};
