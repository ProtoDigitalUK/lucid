import T from "@/translations";
import { type Component, createMemo, Show, Switch, Match, For } from "solid-js";
import { useLocation } from "@solidjs/router";
import Navigation from "@/components/Groups/Navigation";
import type { CollectionResponse } from "@lucidcms/core/types";

export const CollectionSubMenu: Component<{
	state: {
		isLoading: boolean;
		isError: boolean;
		multiCollections: CollectionResponse[];
		singleCollections: CollectionResponse[];
	};
}> = (props) => {
	// ----------------------------------------
	// State
	const location = useLocation();

	// ----------------------------------------
	// Memos
	const showSubMenu = createMemo(() => {
		if (
			props.state.multiCollections.length === 0 &&
			props.state.singleCollections.length === 0
		)
			return false;
		if (location.pathname.includes("/admin/collections")) return true;
	});

	// ----------------------------------------
	// Render
	return (
		<Show when={showSubMenu()}>
			<div class="w-60 py-30 h-full border-l border-border overflow-y-auto">
				<Switch>
					<Match when={props.state.isLoading}>
						<div class="px-15">
							<span class="skeleton block h-10 w-full mb-2.5" />
							<span class="skeleton block h-10 w-full mb-2.5" />
							<span class="skeleton block h-10 w-full mb-2.5" />
							<span class="skeleton block h-10 w-full mb-2.5" />
							<span class="skeleton block h-10 w-full mb-2.5" />
							<span class="skeleton block h-10 w-full mb-2.5" />
						</div>
					</Match>
					<Match when={props.state.isError}>error</Match>
					<Match when={true}>
						{/* Multi Collections */}
						<Show when={props.state.multiCollections.length > 0}>
							<Navigation.LinkGroup
								title={T()("multiple_documents")}
							>
								<For each={props.state.multiCollections}>
									{(collection) => (
										<Navigation.Link
											title={collection.title}
											href={`/admin/collections/${
												collection.key
											}`}
											icon="page"
											activeIfIncludes={`/admin/collections/${collection.key}`}
										/>
									)}
								</For>
							</Navigation.LinkGroup>
						</Show>
						{/* Single Collections */}
						<Show when={props.state.singleCollections.length > 0}>
							<Navigation.LinkGroup
								title={T()("single_documents")}
							>
								<For each={props.state.singleCollections}>
									{(collection) => (
										<Navigation.Link
											title={collection.title}
											href={
												collection.documentId
													? `/admin/collections/${collection.key}/${collection.documentId}`
													: `/admin/collections/${collection.key}/create`
											}
											activeIfIncludes={`/admin/collections/${collection.key}`}
											icon="page"
										/>
									)}
								</For>
							</Navigation.LinkGroup>
						</Show>
					</Match>
				</Switch>
			</div>
		</Show>
	);
};
