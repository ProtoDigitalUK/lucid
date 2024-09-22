import T from "@/translations";
import { useParams, useNavigate } from "@solidjs/router";
import { type Component, createMemo, createEffect } from "solid-js";
import type { CollectionResponse } from "@lucidcms/core/types";
import api from "@/services/api";
import userStore from "@/store/userStore";
import helpers from "@/utils/helpers";
import useSearchParamsLocation, {
	type FilterSchema,
} from "@/hooks/useSearchParamsLocation";
import Query from "@/components/Groups/Query";
import {
	collectionFieldFilters,
	collectionFieldIncludes,
} from "@/utils/document-table-helpers";
import Layout from "@/components/Groups/Layout";
import Headers from "@/components/Groups/Headers";
import Content from "@/components/Groups/Content";

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
		<Layout.Wrapper
			slots={{
				header: (
					<Headers.Standard
						copy={{
							title: collection.data?.data?.title,
							description:
								collection.data?.data?.description || "",
						}}
						actions={{
							contentLocale:
								collection.data?.data.translations ?? false,
							createLink: {
								link: `/admin/collections/${collectionKey()}/create`,
								permission: userStore.get.hasPermission([
									"create_content",
								]).all,
								label: T()("create_dynamic", {
									name: collection.data?.data.singular || "",
								}),
							},
						}}
						slots={{
							bottom: (
								<Query.Row
									searchParams={searchParams}
									filters={getCollectionFieldFilters().map(
										(field) => {
											switch (field.type) {
												case "checkbox": {
													return {
														label: helpers.getLocaleValue(
															{
																value: field
																	.labels
																	.title,
																fallback:
																	field.key,
															},
														),
														key: field.key,
														type: "boolean",
													};
												}
												case "select": {
													return {
														label: helpers.getLocaleValue(
															{
																value: field
																	.labels
																	.title,
																fallback:
																	field.key,
															},
														),
														key: field.key,
														type: "select",
														options:
															field.options?.map(
																(
																	option,
																	i,
																) => ({
																	value: option.value,
																	label: helpers.getLocaleValue(
																		{
																			value: option.label,
																			fallback:
																				T()(
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
														label: helpers.getLocaleValue(
															{
																value: field
																	.labels
																	.title,
																fallback:
																	field.key,
															},
														),
														key: field.key,
														type: "text",
													};
												}
											}
										},
									)}
									perPage={[]}
								/>
							),
						}}
					/>
				),
			}}
		>
			<Content.DocumentsList
				state={{
					collection: collection.data?.data,
					fieldIncludes: getCollectionFieldIncludes,
					searchParams: searchParams,
					isLoading: collection.isLoading,
				}}
			/>
		</Layout.Wrapper>
	);
};

export default CollectionsDocumentsListRoute;
