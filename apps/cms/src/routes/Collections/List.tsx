import T from "@/translations";
import type { Component } from "solid-js";
import useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import Page from "@/components/Groups/Page";
import Headers from "@/components/Groups/Headers";
import PageContent from "@/components/Groups/PageContent";

const CollectionsListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParamsLocation();

	// ----------------------------------
	// Render
	return (
		<Page.Layout
			slots={{
				header: (
					<Headers.Standard
						copy={{
							title: T()("collection_route_title"),
							description: T()("collection_route_description"),
						}}
					/>
				),
			}}
		>
			<PageContent.CollectionsList
				state={{
					searchParams: searchParams,
				}}
			/>
		</Page.Layout>
	);
};

export default CollectionsListRoute;
