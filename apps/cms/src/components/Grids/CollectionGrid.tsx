import T from "@/translations";
import { type Component, For } from "solid-js";
import api from "@/services/api";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import Grid from "@/components/Groups/Grid";
import CollectionCard, {
	CollectionCardLoading,
} from "@/components/Cards/CollectionCard";

interface CollectionGridProps {
	searchParams: ReturnType<typeof useSearchParamsLocation>;
}

const CollectionGrid: Component<CollectionGridProps> = (props) => {
	// ----------------------------------
	// Queries
	const collections = api.collections.useGetAll({
		queryParams: {
			queryString: props.searchParams.getQueryString,
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Render
	return (
		<Grid.Root
			items={collections.data?.data.length || 0}
			state={{
				isLoading: collections.isLoading,
				isError: collections.isError,
				isSuccess: collections.isSuccess,
			}}
			options={{
				showNoEntries: true,
			}}
			copy={{
				noEntryTitle: T()("no_collections"),
				noEntryDescription: T()("no_collections_description"),
			}}
			searchParams={props.searchParams}
			loadingCard={<CollectionCardLoading />}
		>
			<For each={collections.data?.data}>
				{(item) => CollectionCard({ collection: item })}
			</For>
		</Grid.Root>
	);
};

export default CollectionGrid;
