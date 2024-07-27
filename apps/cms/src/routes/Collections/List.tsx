import T from "@/translations";
import type { Component } from "solid-js";
import useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import Layout from "@/components/Groups/Layout";
import CollectionGrid from "@/components/Grids/CollectionGrid";

const CollectionsListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParamsLocation();

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T()("collection_route_title")}
			description={T()("collection_route_description")}
		>
			<CollectionGrid searchParams={searchParams} />
		</Layout.PageLayout>
	);
};

export default CollectionsListRoute;
