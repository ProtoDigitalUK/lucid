import T from "@/translations";
import { type Component, Show, For, createMemo, Switch, Match } from "solid-js";
import { useParams, useLocation } from "@solidjs/router";
// Types
import type { CollectionResT } from "@headless/types/src/collections";
// Components
import Navigation from "@/components/Groups/Navigation";

interface CollectionsBarProps {
	collections: CollectionResT[];
	state: {
		isLoading: boolean;
		isError: boolean;
	};
}

export const CollectionsBar: Component<CollectionsBarProps> = (props) => {
	// ----------------------------------
	// Hooks & States
	const location = useLocation();
	const params = useParams();

	// ----------------------------------
	// Memos
	const showBar = createMemo(() => {
		if (params.id !== undefined) {
			return false;
		}
		if (location.pathname.includes("/collection/")) {
			return true;
		}
		return false;
	});
	const multipleBuilderCollections = createMemo(() => {
		return props.collections.filter(
			(collection) =>
				collection.type === "builder" && collection.multiple === true,
		);
	});
	const singleBuilderCollections = createMemo(() => {
		return props.collections.filter(
			(collection) =>
				collection.type === "builder" && collection.multiple === false,
		);
	});

	// ----------------------------------
	// Render
	return (
		<Show when={showBar()}>
			<div class="w-[240px] py-15 bg-container border-r border-border h-full">
				<nav class="relative">
					<Switch>
						<Match when={props.state.isLoading}>
							<div class="px-15">
								<span class="skeleton block h-12 w-full mb-2.5" />
								<span class="skeleton block h-12 w-full mb-2.5" />
								<span class="skeleton block h-12 w-full mb-2.5" />
								<span class="skeleton block h-12 w-full mb-2.5" />
								<span class="skeleton block h-12 w-full mb-2.5" />
								<span class="skeleton block h-12 w-full mb-2.5" />
							</div>
						</Match>
						<Match when={props.state.isError}>error</Match>
						<Match when={true}>
							{/* Multi Collections */}
							<Show
								when={multipleBuilderCollections().length > 0}
							>
								<Navigation.LinkGroup
									title={T("multi_builder_collections")}
								>
									<For each={multipleBuilderCollections()}>
										{(collection) => (
											<Navigation.Link
												title={collection.title}
												href={`/collection/${collection.key}/multiple-builder`}
												icon="page"
											/>
										)}
									</For>
								</Navigation.LinkGroup>
							</Show>
							{/* Single Collections */}
							<Show when={singleBuilderCollections().length > 0}>
								<Navigation.LinkGroup
									title={T("single_builder_collections")}
								>
									<For each={singleBuilderCollections()}>
										{(collection) => (
											<Navigation.Link
												title={collection.title}
												href={`/collection/${collection.key}/single-builder`}
												icon="page"
											/>
										)}
									</For>
								</Navigation.LinkGroup>
							</Show>
						</Match>
					</Switch>
				</nav>
			</div>
		</Show>
	);
};
