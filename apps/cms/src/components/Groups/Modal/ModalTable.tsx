import T from "@/translations";
import {
	type Component,
	type JSXElement,
	Show,
	createMemo,
	Switch,
	Match,
} from "solid-js";
import type { ResponseBody } from "@lucidcms/core/types";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import notifySvg from "@/assets/illustrations/notify.svg";
import noPermission from "@/assets/illustrations/no-permission.svg";
import Query from "@/components/Groups/Query";
import ErrorBlock from "@/components/Partials/ErrorBlock";
import Button from "@/components/Partials/Button";
import NoEntriesBlock from "@/components/Partials/NoEntriesBlock";

interface ModalTableProps {
	rows: number;
	permission?: boolean;
	meta?: ResponseBody<unknown>["meta"];
	searchParams: ReturnType<typeof useSearchParamsLocation>;
	state: {
		isLoading: boolean;
		isError: boolean;
		isSuccess: boolean;
	};
	options?: {
		showNoEntries?: boolean;
	};
	copy?: {
		noEntryTitle?: string;
		noEntryDescription?: string;
		noEntryButton?: string;
		noResultTitle?: string;
		noResultDescription?: string;
	};
	callbacks?: {
		createEntry?: () => void;
	};
	children: JSXElement;
}

export const ModalTable: Component<ModalTableProps> = (props) => {
	// ----------------------------------------
	// Memos
	const showNoEntries = createMemo(() => {
		return (
			props.options?.showNoEntries === true &&
			!props.searchParams.hasFiltersApplied()
		);
	});

	// ----------------------------------------
	// Render
	return (
		<>
			<Switch>
				<Match when={props.permission === false}>
					<ErrorBlock
						content={{
							image: noPermission,
							title: T()("no_permission"),
							description: T()("no_permission_description"),
						}}
					/>
				</Match>
				<Match when={props.state.isError}>
					<ErrorBlock
						content={{
							image: notifySvg,
							title: T()("error_title"),
							description: T()("error_message"),
						}}
					/>
				</Match>
				<Match
					when={props.rows === 0 && props.state.isLoading === false}
				>
					<Show when={showNoEntries()}>
						<NoEntriesBlock
							copy={{
								title: props.copy?.noEntryTitle,
								description: props.copy?.noEntryDescription,
								button: props.copy?.noEntryButton,
							}}
							callbacks={{
								action: props.callbacks?.createEntry,
							}}
						/>
					</Show>
					<Show when={!showNoEntries()}>
						<ErrorBlock
							content={{
								title:
									props.copy?.noResultTitle ??
									T()("no_results"),
								description:
									props.copy?.noResultDescription ??
									T()("no_results_message"),
							}}
						>
							<Show when={props.searchParams.hasFiltersApplied()}>
								<Button
									type="submit"
									theme="primary"
									size="medium"
									onClick={() => {
										props.searchParams.resetFilters();
									}}
								>
									{T()("reset_filters")}
								</Button>
							</Show>
						</ErrorBlock>
					</Show>
				</Match>
				<Match when={props.state.isSuccess || props.state.isLoading}>
					{props.children}
				</Match>
			</Switch>
			<Show when={props.meta}>
				<div class="px-15 md:px-30 pt-15 md:pt-30">
					<Query.Pagination
						state={{
							meta: props.meta,
							searchParams: props.searchParams,
						}}
					/>
				</div>
			</Show>
		</>
	);
};
