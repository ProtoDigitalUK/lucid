import T from "@/translations";
import { type Component, type JSXElement, Switch, Match, Show } from "solid-js";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import classNames from "classnames";
import notifySvg from "@/assets/illustrations/notify.svg";
import noPermission from "@/assets/illustrations/no-permission.svg";
import NoEntriesBlock from "@/components/Partials/NoEntriesBlock";
import ErrorBlock from "@/components/Partials/ErrorBlock";
import Loading from "@/components/Partials/Loading";
import Button from "@/components/Partials/Button";

export const DynamicContent: Component<{
	state?: {
		isError?: boolean;
		isSuccess?: boolean;
		isEmpty?: boolean;
		isLoading?: boolean;
		hasPermission?: boolean;
		searchParams?: ReturnType<typeof useSearchParamsLocation>;
	};
	slot?: {
		/** The footer slot - can be used instead of the Layout footer slot if the footer needs state from the content. */
		footer?: JSXElement;
	};
	copy?: {
		noEntries?: {
			title?: string;
			description?: string;
			button?: string;
		};
		error?: {
			title?: string;
			description?: string;
		};
	};
	callback?: {
		createEntry?: () => void;
	};
	options?: {
		padding?: "15" | "30";
		hideNoEntries?: boolean;
	};
	children: JSXElement;
}> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<>
			<div
				class={classNames("flex flex-col flex-1 h-full", {
					"p-15 md:p-30": props.options?.padding === "30",
					"p-15": props.options?.padding === "15",
				})}
			>
				<Switch fallback={props.children}>
					<Match when={props.state?.isError}>
						<div class="flex-1 flex items-center justify-center">
							<ErrorBlock
								content={{
									image: notifySvg,
									title: props.copy?.error?.title,
									description: props.copy?.error?.description,
								}}
							/>
						</div>
					</Match>
					<Match
						when={props.state?.isEmpty && props.options?.hideNoEntries !== true}
					>
						<div class="flex-1 flex items-center justify-center">
							<Show when={!props.state?.searchParams?.hasFiltersApplied()}>
								<NoEntriesBlock
									copy={{
										title: props.copy?.noEntries?.title,
										description: props.copy?.noEntries?.description,
										button: props.copy?.noEntries?.button,
									}}
									callbacks={{
										action: props.callback?.createEntry,
									}}
								/>
							</Show>
							<Show when={props.state?.searchParams?.hasFiltersApplied()}>
								<ErrorBlock
									content={{
										title: T()("no_results"),
										description: T()("no_results_message"),
									}}
								>
									<Button
										type="submit"
										theme="primary"
										size="medium"
										onClick={() => {
											props.state?.searchParams?.resetFilters();
										}}
									>
										{T()("reset_filters")}
									</Button>
								</ErrorBlock>
							</Show>
						</div>
					</Match>
					<Match when={props.state?.isLoading}>
						<div class="flex-1 flex items-center justify-center">
							<Loading />
						</div>
					</Match>
					<Match when={props.state?.hasPermission === false}>
						<ErrorBlock
							content={{
								image: noPermission,
								title: T()("no_permission"),
								description: T()("no_permission_description"),
							}}
						/>
					</Match>
					<Match when={props.state?.isSuccess}>{props.children}</Match>
				</Switch>
			</div>
			{props.slot?.footer}
		</>
	);
};
