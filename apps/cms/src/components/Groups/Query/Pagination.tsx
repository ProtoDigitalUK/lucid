import T from "@/translations";
import {
	type Component,
	Show,
	Switch,
	createEffect,
	createMemo,
	createSignal,
	Match,
} from "solid-js";
import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";
// Types
import type { ResponseBody } from "@protoheadless/core/types";
// Hooks
import type useSearchParams from "@/hooks/useSearchParams";
// Components
import Layout from "@/components/Groups/Layout";
import { Pagination as KobPagination } from "@kobalte/core";

interface PaginationProps {
	meta?: ResponseBody<unknown>["meta"];
	searchParams: ReturnType<typeof useSearchParams>;
	mode: "page" | "modal";
}

export const Pagination: Component<PaginationProps> = (props) => {
	const [page, setPage] = createSignal(1);

	// -------------------------------------
	// Memos
	const textData = createMemo(() => {
		return {
			page: props.meta?.currentPage ?? 1,
			lastPage: props.meta?.lastPage ?? 1,
			total: props.meta?.total ?? 0,
		};
	});
	const lastPage = createMemo(() => {
		return props.meta?.lastPage ?? 1;
	});

	// -------------------------------------
	// Effects
	createEffect(() => {
		setPage(props.meta?.currentPage ?? 1);
	});

	// -------------------------------------
	// Render
	const InnerComponent = (
		<div class="flex md:flex-row flex-col justify-between md:items-center">
			<span class="text-sm text-body md:mb-0 mb-2">
				<Switch>
					<Match when={textData().total === 0}>
						{T("pagination_empty")}
					</Match>
					<Match when={textData().total > 0}>
						{T("pagination_text", {
							page: textData().page,
							lastPage: textData().lastPage,
							total: textData().total,
						})}
					</Match>
				</Switch>
			</span>
			<Show when={lastPage() > 1}>
				<KobPagination.Root
					class="flex [&>ul]:flex [&>ul]:border [&>ul]:border-border [&>ul]:rounded-md [&>ul]:overflow-hidden"
					page={page()}
					onPageChange={(page) => {
						props.searchParams.setParams({
							pagination: {
								page: page,
								per_page: props.meta?.perPage || undefined,
							},
						});
						setPage(page);
					}}
					count={lastPage()}
					itemComponent={(props) => (
						<KobPagination.Item
							class="h-10 w-10 flex items-center justify-center [&[data-current]]:bg-primary [&[data-current]]:text-primaryText hover:bg-primary hover:text-primaryText duration-200 transition-colors"
							page={props.page}
						>
							{props.page}
						</KobPagination.Item>
					)}
					ellipsisComponent={() => (
						<KobPagination.Ellipsis class="h-10 w-10 flex items-center justify-center">
							...
						</KobPagination.Ellipsis>
					)}
				>
					<KobPagination.Previous class="h-10 w-10 flex items-center justify-center fill-title hover:bg-primary hover:fill-primaryText duration-200 transition-colors disabled:opacity-50">
						<FaSolidChevronLeft />
					</KobPagination.Previous>
					<KobPagination.List />
					<KobPagination.Next class="h-10 w-10 flex items-center justify-center fill-title hover:bg-primary hover:fill-primaryText duration-200 transition-colors disabled:opacity-50">
						<FaSolidChevronRight />
					</KobPagination.Next>
				</KobPagination.Root>
			</Show>
		</div>
	);

	return (
		<Switch>
			<Match when={props.mode === "modal"}>
				<div class="mt-15 pt-15 border-t border-border">
					{InnerComponent}
				</div>
			</Match>
			<Match when={props.mode === "page"}>
				<Layout.PageFooter>{InnerComponent}</Layout.PageFooter>
			</Match>
		</Switch>
	);
};
