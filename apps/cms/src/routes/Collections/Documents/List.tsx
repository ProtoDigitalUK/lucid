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
			if (collection.data.data.mode === "single") {
				navigate("/admin/collections");
			}
		}
	});

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
				fieldIncludes={collectionFieldInclude}
			/>
		</Layout.PageLayout>
	);
};

export default CollectionsDocumentsListRoute;
