import T from "@/translations";
import { type Component, createMemo, createEffect, Index } from "solid-js";
import { FaSolidCalendar } from "solid-icons/fa";
import type { CollectionResponse } from "@lucidcms/core/types";
import useSearchParamsState from "@/hooks/useSearchParamsState";
import type { FilterSchema } from "@/hooks/useSearchParamsLocation";
import documentSelectStore from "@/store/forms/documentSelectStore";
import contentLocaleStore from "@/store/contentLocaleStore";
import api from "@/services/api";
import Query from "@/components/Groups/Query";
import helpers from "@/utils/helpers";
import Modal from "@/components/Groups/Modal";
import Table from "@/components/Groups/Table";
import DocumentRow from "@/components/Tables/Rows/DocumentRow";
import Layout from "@/components/Groups/Layout";
import {
	tableHeadColumns,
	collectionFieldFilters,
	collectionFieldIncludes,
} from "@/utils/document-table-helpers";

const DocumentSelectModal: Component = () => {
	const open = createMemo(() => documentSelectStore.get.open);

	// ---------------------------------
	// Render
	return (
		<Modal.Root
			state={{
				open: open(),
				setOpen: () => documentSelectStore.set("open", false),
			}}
			options={{
				noPadding: true,
				size: "large",
			}}
		>
			<DocumentSelectContent />
		</Modal.Root>
	);
};

const DocumentSelectContent: Component = () => {
	// ------------------------------
	// Hooks
	const searchParams = useSearchParamsState({
		filters: {},
		sorts: {},
		pagination: {
			perPage: 20,
		},
	});

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => documentSelectStore.get.collectionKey);
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale ?? "",
	);

	// ----------------------------------
	// Queries
	const collection = api.collections.useGetSingle({
		queryParams: {
			location: {
				collectionKey: collectionKey,
			},
		},
		enabled: () => !!collectionKey(),
	});
	const documents = api.collections.document.useGetMultiple({
		queryParams: {
			queryString: searchParams.getQueryString,
			location: {
				collectionKey: collectionKey,
				versionType: "draft",
			},
		},
		enabled: () => searchParams.getSettled() && collection.isSuccess,
	});

	// ----------------------------------
	// Memos
	const getCollectionFieldIncludes = createMemo(() =>
		collectionFieldIncludes(collection.data?.data),
	);
	const getCollectionFieldFilters = createMemo(() =>
		collectionFieldFilters(collection.data?.data),
	);
	const getTableHeadColumns = createMemo(() =>
		tableHeadColumns(getCollectionFieldIncludes()),
	);

	const isSuccess = createMemo(
		() => documents.isSuccess || collection.isSuccess,
	);
	const isError = createMemo(() => documents.isError || collection.isError);

	// ----------------------------------
	// Effects
	createEffect(() => {
		if (collection.isSuccess) {
			const filterConfig: FilterSchema = {};
			for (const field of getCollectionFieldFilters()) {
				switch (field.type) {
					default: {
						filterConfig[field.key] = {
							type: "text",
							value: "",
						};
						break;
					}
				}
			}
			searchParams.setFilterSchema(filterConfig);
		}
	});

	// ----------------------------------
	// Render
	return (
		<div class="min-h-[70vh] flex flex-col">
			{/* Header */}
			<div class="p-15 md:p-30 border-b border-border">
				<h2>{T()("select_document_title")}</h2>
				<p class="mt-1">{T()("select_document_description")}</p>
				<div class="w-full mt-15 flex justify-between">
					<div class="flex gap-5">
						<Query.Filter
							filters={getCollectionFieldFilters().map((field) => {
								switch (field.type) {
									case "checkbox": {
										return {
											label: helpers.getLocaleValue({
												value: field.labels.title,
												fallback: field.key,
											}),
											key: field.key,
											type: "boolean",
										};
									}
									case "select": {
										return {
											label: helpers.getLocaleValue({
												value: field.labels.title,
												fallback: field.key,
											}),
											key: field.key,
											type: "select",
											options: field.options?.map((option, i) => ({
												value: option.value,
												label: helpers.getLocaleValue({
													value: option.label,
													fallback: T()("option_label", {
														count: i,
													}),
												}),
											})),
										};
									}
									default: {
										return {
											label: helpers.getLocaleValue({
												value: field.labels.title,
												fallback: field.key,
											}),
											key: field.key,
											type: "text",
										};
									}
								}
							})}
							searchParams={searchParams}
						/>
					</div>
					<div>
						<Query.PerPage options={[10, 20, 40]} searchParams={searchParams} />
					</div>
				</div>
			</div>
			{/* Body */}
			<div class="flex-1 flex w-full flex-col">
				<Layout.DynamicContent
					state={{
						isError: isError(),
						isSuccess: isSuccess(),
						searchParams: searchParams,
						isEmpty: documents.data?.data.length === 0,
						isLoading: collection.isLoading,
					}}
					options={{}}
					copy={{
						noEntries: {
							title: T()("no_documents", {
								collectionMultiple: collection.data?.data.title,
							}),
							description: T()("no_documents_description_doc_select", {
								collectionMultiple: collection.data?.data?.title.toLowerCase(),
								collectionSingle: collection.data?.data?.singular.toLowerCase(),
							}),
							button: T()("create_document", {
								collectionSingle: collection.data?.data?.singular,
							}),
						},
					}}
				>
					<Table.Root
						key={`collections.document.list.${collection.data?.data?.key}`}
						rows={documents.data?.data.length || 0}
						searchParams={searchParams}
						head={[
							...getTableHeadColumns(),
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
					>
						{({ include, isSelectable, selected, setSelected }) => (
							<Index each={documents.data?.data || []}>
								{(doc, i) => (
									<DocumentRow
										index={i}
										document={doc()}
										fieldInclude={getCollectionFieldIncludes()}
										collection={collection.data?.data as CollectionResponse}
										include={include}
										contentLocale={contentLocale()}
										selected={selected[i]}
										options={{
											isSelectable,
										}}
										callbacks={{
											setSelected: setSelected,
											onClick: () => {
												documentSelectStore.get.onSelectCallback(doc());
												documentSelectStore.set("open", false);
											},
										}}
										current={doc().id === documentSelectStore.get.selected}
									/>
								)}
							</Index>
						)}
					</Table.Root>
				</Layout.DynamicContent>
			</div>
		</div>
	);
};

export default DocumentSelectModal;
