import { type Component, Show } from "solid-js";
import type useSearchParams from "@/hooks/useSearchParams";
import type { FilterProps } from "@/components/Groups/Query/Filter";
import type { SortProps } from "@/components/Groups/Query/Sort";
import Query from "@/components/Groups/Query";

interface QueryRowProps {
	filters?: FilterProps["filters"];
	sorts?: SortProps["sorts"];
	perPage?: Array<number>;
	searchParams: ReturnType<typeof useSearchParams>;
}

export const QueryRow: Component<QueryRowProps> = (props) => {
	return (
		<div class="w-full px-15 md:px-30 pb-30 flex justify-between">
			<div class="flex gap-2.5">
				<Show when={props.filters !== undefined}>
					<Query.Filter
						filters={props.filters as FilterProps["filters"]}
						searchParams={props.searchParams}
						disabled={props.filters?.length === 0}
					/>
				</Show>
				<Show when={props.sorts !== undefined}>
					<Query.Sort
						sorts={props.sorts as SortProps["sorts"]}
						searchParams={props.searchParams}
					/>
				</Show>
			</div>
			<div>
				<Show when={props.perPage !== undefined}>
					<Query.PerPage
						options={
							props.perPage?.length === 0
								? undefined
								: props.perPage
						}
						searchParams={props.searchParams}
					/>
				</Show>
			</div>
		</div>
	);
};
