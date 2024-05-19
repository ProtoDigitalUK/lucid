import T from "@/translations";
import {
	type Component,
	Show,
	Switch,
	Match,
	type JSXElement,
	createMemo,
} from "solid-js";
import type { ResponseBody } from "@lucidcms/core/types";
import type useSearchParams from "@/hooks/useSearchParams";
import notifySvg from "@/assets/illustrations/notify.svg";
import noPermission from "@/assets/illustrations/no-permission.svg";
import Query from "@/components/Groups/Query";
import ErrorBlock from "@/components/Partials/ErrorBlock";
import Button from "@/components/Partials/Button";
import SkeletonCard from "@/components/Cards/SkeletonCard";
import Layout from "@/components/Groups/Layout";
import NoEntriesBlock from "@/components/Partials/NoEntriesBlock";

interface GridRootProps {
	items: number;
	state: {
		isLoading: boolean;
		isError: boolean;
		isSuccess: boolean;
	};
	options?: {
		showCreateEntry?: boolean;
	};
	callbacks?: {
		createEntry?: () => void;
	};
	copy?: {
		noEntryTitle?: string;
		noEntryDescription?: string;
		noEntryButton?: string;
	};
	searchParams?: ReturnType<typeof useSearchParams>;
	permission?: boolean;
	meta?: ResponseBody<unknown>["meta"];
	loadingCard?: JSXElement;
	children: JSXElement;
}

export const GridRoot: Component<GridRootProps> = (props) => {
	// ----------------------------------
	// Memos
	const showCreateEntry = createMemo(() => {
		return (
			props.options?.showCreateEntry === true &&
			!props.searchParams?.hasFiltersApplied()
		);
	});

	// ----------------------------------
	// Render
	return (
		<>
			<Switch>
				<Match when={props.permission === false}>
					<ErrorBlock
						type="page-layout"
						content={{
							image: noPermission,
							title: T()("no_permission"),
							description: T()("no_permission_description"),
						}}
					/>
				</Match>
				<Match when={props.state.isError}>
					<ErrorBlock
						type="page-layout"
						content={{
							image: notifySvg,
							title: T()("error_title"),
							description: T()("error_message"),
						}}
					/>
				</Match>
				<Match
					when={props.items === 0 && props.state.isLoading === false}
				>
					<Show when={showCreateEntry()}>
						<NoEntriesBlock
							copy={{
								title: props.copy?.noEntryTitle,
								description: props.copy?.noEntryDescription,
								button: props.copy?.noEntryButton,
							}}
							action={props.callbacks?.createEntry}
						/>
					</Show>
					<Show when={!showCreateEntry()}>
						<ErrorBlock
							type="page-layout"
							content={{
								title: T()("no_results"),
								description: T()("no_results_message"),
							}}
						>
							<Show
								when={props.searchParams?.hasFiltersApplied()}
							>
								<Button
									type="submit"
									theme="primary"
									size="medium"
									onClick={() => {
										props.searchParams?.resetFilters();
									}}
								>
									{T()("reset_filters")}
								</Button>
							</Show>
						</ErrorBlock>
					</Show>
				</Match>
				<Match when={props.state.isSuccess || props.state.isLoading}>
					<Layout.PageContent>
						<ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-15">
							<Switch>
								<Match when={props.state.isLoading}>
									<Switch>
										<Match when={props.loadingCard}>
											{props.loadingCard}
											{props.loadingCard}
											{props.loadingCard}
											{props.loadingCard}
											{props.loadingCard}
											{props.loadingCard}
											{props.loadingCard}
											{props.loadingCard}
										</Match>
										<Match when={!props.loadingCard}>
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
											<SkeletonCard size="medium" />
										</Match>
									</Switch>
								</Match>
								<Match when={props.state.isSuccess}>
									{props.children}
								</Match>
							</Switch>
						</ul>
					</Layout.PageContent>
				</Match>
			</Switch>
			{/* Pagination */}
			<Show when={props.meta && props.searchParams}>
				<Query.Pagination
					meta={props.meta}
					searchParams={
						props.searchParams as ReturnType<typeof useSearchParams>
					}
					mode="page"
				/>
			</Show>
		</>
	);
};
