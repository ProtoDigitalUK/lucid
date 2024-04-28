import T from "@/translations";
import { useParams } from "@solidjs/router";
import { type Component, createMemo } from "solid-js";
import type { CollectionResponse } from "@protoheadless/core/types";
import api from "@/services/api";
import useSearchParams from "@/hooks/useSearchParams";
import Layout from "@/components/Groups/Layout";
import DocumentsTable from "@/components/Tables/DocumentsTable";

const CollectionsDocumentsListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();
	const searchParams = useSearchParams();

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
		>
			<DocumentsTable
				searchParams={searchParams}
				collection={collection.data?.data as CollectionResponse}
			/>
		</Layout.PageLayout>
	);
};

export default CollectionsDocumentsListRoute;
