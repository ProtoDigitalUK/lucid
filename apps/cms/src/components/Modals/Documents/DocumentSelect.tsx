import T from "@/translations";
import { type Component, createMemo, createEffect } from "solid-js";
import type {
	CFConfig,
	FieldTypes,
	CollectionResponse,
} from "@lucidcms/core/types";
import useSearchParamsState from "@/hooks/useSearchParamsState";
import type { FilterSchema } from "@/hooks/useSearchParamsLocation";
import documentSelectStore from "@/store/forms/documentSelectStore";
import api from "@/services/api";
import Query from "@/components/Groups/Query";
import helpers from "@/utils/helpers";
import Modal from "@/components/Groups/Modal";
import DocumentsTable from "@/components/Tables/DocumentsTable";

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
			<div class="px-15 md:px-30 pt-15 md:pt-30">
				<h2>{T()("select_document_title")}</h2>
				<p class="mt-1">{T()("select_document_description")}</p>
				<div class="w-full mt-15 flex justify-between pb-15 border-b border-border">
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
			<div class="relative w-full flex h-full flex-col justify-between px-15 md:px-30 pb-15 md:pb-30 mt-15 flex-grow">
				{/* <DocumentsTable
					searchParams={searchParams}
					collection={collection.data?.data as CollectionResponse}
					fieldIncludes={collectionFieldInclude}
				/> */}
			</div>
		</div>
	);
};

export default DocumentSelectModal;
