import T from "@/translations";
import { useParams, useNavigate } from "@solidjs/router";
import { type Component, createMemo, createEffect } from "solid-js";
import type {
	CollectionResponse,
	CFConfig,
	FieldTypes,
} from "@lucidcms/core/types";
import api from "@/services/api";
import userStore from "@/store/userStore";
import helpers from "@/utils/helpers";
import useSearchParamsLocation, {
	type FilterSchema,
} from "@/hooks/useSearchParamsLocation";
import Layout from "@/components/Groups/Layout";
import DocumentsTable from "@/components/Tables/DocumentsTable";
import Query from "@/components/Groups/Query";
import {
	collectionFieldFilters,
	collectionFieldIncludes,
} from "@/utils/document-table-helpers";

const CollectionsDocumentsListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();
	const navigate = useNavigate();
	const searchParams = useSearchParamsLocation(undefined, {
		manualSettled: true,
	});

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);

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
	const getCollectionFieldIncludes = createMemo(() =>
		collectionFieldIncludes(collection.data?.data),
	);
	const getCollectionFieldFilters = createMemo(() =>
		collectionFieldFilters(collection.data?.data),
	);

	// ----------------------------------
	// Effects
	createEffect(() => {
		if (collection.isSuccess) {
			if (collection.data.data.mode === "single") {
				navigate("/admin/collections");
			}
		}
	});

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
		<Layout.PageLayout
			title={collection.data?.data.title}
			description={collection.data?.data.description || ""}
			options={{
				noBorder: true,
			}}
			state={{
				isLoading: collection.isLoading,
				isError: collection.isError,
				isSuccess: collection.isSuccess,
			}}
			actions={{
				contentLocale: collection.data?.data.translations ?? false,
				createLink: {
					link: `/admin/collections/${collectionKey()}/create`,
					permission: userStore.get.hasPermission(["create_content"])
						.all,
					label: T()("create_dynamic", {
						name: collection.data?.data.singular || "",
					}),
				},
			}}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
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
									options: field.options?.map(
										(option, i) => ({
											value: option.value,
											label: helpers.getLocaleValue({
												value: option.label,
												fallback: T()("option_label", {
													count: i,
												}),
											}),
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
					perPage={[]}
				/>
			}
		>
			<DocumentsTable
				searchParams={searchParams}
				collection={collection.data?.data as CollectionResponse}
				fieldIncludes={getCollectionFieldIncludes}
			/>
		</Layout.PageLayout>
	);
};

export default CollectionsDocumentsListRoute;
