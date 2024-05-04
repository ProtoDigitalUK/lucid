import T from "@/translations";
import { useParams, useNavigate } from "@solidjs/router";
import { type Component, createMemo, createEffect } from "solid-js";
import type { CollectionResponse, CustomField } from "@lucidcms/core/types";
import api from "@/services/api";
import useSearchParams, { type FilterSchema } from "@/hooks/useSearchParams";
import Layout from "@/components/Groups/Layout";
import DocumentsTable from "@/components/Tables/DocumentsTable";
import Query from "@/components/Groups/Query";

const CollectionsDocumentsListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();
	const navigate = useNavigate();
	const searchParams = useSearchParams(undefined, {
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
		const fieldsRes: CustomField[] = [];

		const fieldRecursive = (fields?: CustomField[]) => {
			if (!fields) return;
			for (const field of fields) {
				if (field.type === "repeater" && field.fields) {
					fieldRecursive(field.fields);
					return;
				}
				if (field.collection?.list !== true) return;

				fieldsRes.push(field);
			}
		};
		fieldRecursive(collection.data?.data.fields);

		return fieldsRes;
	});
	const collectionFieldFilter = createMemo(() => {
		const fieldsRes: CustomField[] = [];

		const fieldRecursive = (fields?: CustomField[]) => {
			if (!fields) return;
			for (const field of fields) {
				if (field.type === "repeater" && field.fields) {
					fieldRecursive(field.fields);
					return;
				}
				if (field.collection?.filterable !== true) return;

				fieldsRes.push(field);
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
				navigate("/collections");
			}
		}
	});

	createEffect(() => {
		if (collection.isSuccess) {
			const filterConfig: FilterSchema = {};
			for (const field of collectionFieldInclude()) {
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
				contentLanguage: collection.data?.data.translations ?? false,
			}}
			breadcrumbs={[
				{
					link: "/collections",
					label: T("collections"),
				},
				{
					link: `/collections/${collectionKey()}`,
					label: collection.data?.data.title || T("documents"),
				},
			]}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
					filters={collectionFieldFilter().map((field) => {
						switch (field.type) {
							case "checkbox": {
								return {
									label: field.title || field.key,
									key: field.key,
									type: "boolean",
								};
							}
							case "select": {
								return {
									label: field.title || field.key,
									key: field.key,
									type: "select",
									options: field.options?.map((option) => ({
										value: option.value,
										label: option.label,
									})),
								};
							}
							default: {
								return {
									label: field.title || field.key,
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
