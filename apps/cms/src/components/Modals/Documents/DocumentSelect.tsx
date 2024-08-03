import T from "@/translations";
import { type Component, createMemo, createEffect, Index } from "solid-js";
import { FaSolidT, FaSolidCalendar, FaSolidUser } from "solid-icons/fa";
import type {
	CFConfig,
	FieldTypes,
	CollectionResponse,
} from "@lucidcms/core/types";
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
	const collectionKey = createMemo(
		() => documentSelectStore.get.collectionKey,
	);
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
			},
		},
		enabled: () => searchParams.getSettled() && collection.isSuccess,
	});

	// ----------------------------------
	// Memos
	const collectionFieldInclude = createMemo(() => {
		const fieldsRes: CFConfig<FieldTypes>[] = [];

		const fieldRecursive = (fields?: CFConfig<FieldTypes>[]) => {
			if (!fields) return;
			for (const field of fields) {
				if (field.type === "repeater" && field.fields) {
					fieldRecursive(field.fields);
					return;
				}
				if (collection.data?.data.fieldIncludes.includes(field.key)) {
					fieldsRes.push(field);
				}
			}
		};
		fieldRecursive(collection.data?.data.fields);

		return fieldsRes;
	});
	const collectionFieldFilter = createMemo(() => {
		const fieldsRes: CFConfig<FieldTypes>[] = [];

		const fieldRecursive = (fields?: CFConfig<FieldTypes>[]) => {
			if (!fields) return;
			for (const field of fields) {
				if (field.type === "repeater" && field.fields) {
					fieldRecursive(field.fields);
					return;
				}
				if (collection.data?.data.fieldFilters.includes(field.key)) {
					fieldsRes.push(field);
				}
			}
		};
		fieldRecursive(collection.data?.data.fields);

		return fieldsRes;
	});
	const tableHeadColumns = createMemo(() => {
		return collectionFieldInclude().map((field) => {
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

	const isLoading = createMemo(
		() => documents.isLoading || collection.isLoading,
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
			for (const field of collectionFieldFilter()) {
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
							filters={collectionFieldFilter().map((field) => {
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
											options: field.options?.map(
												(option, i) => ({
													value: option.value,
													label: helpers.getLocaleValue(
														{
															value: option.label,
															fallback: T()(
																"option_label",
																{
																	count: i,
																},
															),
														},
													),
												}),
											),
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
						<Query.PerPage
							options={[10, 20, 40]}
							searchParams={searchParams}
						/>
					</div>
				</div>
			</div>
			{/* Body */}
			<div class="relative w-full flex h-full flex-col justify-between pb-15 md:pb-30 flex-grow -mt-px">
				<Modal.Table
					rows={documents.data?.data.length || 0}
					meta={documents.data?.meta}
					searchParams={searchParams}
					state={{
						isLoading: isLoading(),
						isError: isError(),
						isSuccess: isSuccess(),
					}}
					options={{
						showNoEntries: true,
					}}
					copy={{
						noEntryTitle: T()("no_documents", {
							collectionMultiple: collection.data?.data.title,
						}),
						noEntryDescription: T()(
							"no_documents_description_doc_select",
							{
								collectionMultiple:
									collection.data?.data?.title.toLowerCase(),
								collectionSingle:
									collection.data?.data?.singular.toLowerCase(),
							},
						),
						noEntryButton: T()("create_document", {
							collectionSingle: collection.data?.data?.singular,
						}),
					}}
				>
					<Table.Root
						key={`collections.document.list.${collection.data?.data?.key}`}
						rows={documents.data?.data.length || 0}
						searchParams={searchParams}
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
					>
						{({ include, isSelectable, selected, setSelected }) => (
							<Index each={documents.data?.data || []}>
								{(doc, i) => (
									<DocumentRow
										index={i}
										document={doc()}
										fieldInclude={collectionFieldInclude()}
										collection={
											collection.data
												?.data as CollectionResponse
										}
										include={include}
										contentLocale={contentLocale()}
										selected={selected[i]}
										options={{
											isSelectable,
										}}
										callbacks={{
											setSelected: setSelected,
											onClick: () => {
												documentSelectStore.get.onSelectCallback(
													doc(),
												);
												documentSelectStore.set(
													"open",
													false,
												);
											},
										}}
										current={
											doc().id ===
											documentSelectStore.get.selected
										}
									/>
								)}
							</Index>
						)}
					</Table.Root>
				</Modal.Table>
			</div>
		</div>
	);
};

export default DocumentSelectModal;
