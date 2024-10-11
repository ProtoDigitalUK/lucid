import T from "@/translations";
import { type Accessor, type Component, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import classNames from "classnames";
import type { CollectionDocumentVersionResponse } from "@lucidcms/core/types";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import DateText from "@/components/Partials/DateText";
import Pill from "@/components/Partials/Pill";

export const RevisionsSidebar: Component<{
	revisions: CollectionDocumentVersionResponse[];
	versionId: Accessor<number | undefined>;
	collectionKey: Accessor<string | undefined>;
	documentId: Accessor<number | undefined>;
	searchParams: ReturnType<typeof useSearchParamsLocation>;
}> = (props) => {
	// ----------------------------------
	// State
	const navigate = useNavigate();

	// ----------------------------------
	// Render
	return (
		<aside
			class={
				"w-full lg:max-w-[300px] p-15 md:p-30 lg:overflow-y-auto bg-container-5 border-b lg:border-b-0 lg:border-l border-border"
			}
		>
			<h2 class="mb-15">{T()("revision_history")}</h2>
			{/* TODO: add loading state */}
			{/* TODO: add sorting */}
			<For each={props.revisions}>
				{(revision) => (
					<button
						type="button"
						class={classNames(
							"bg-container-2 border-border border rounded-md mb-2.5 last:mb-0 flex flex-col p-15 focus:ring-1 focus:ring-primary-base duration-200 transition-colors hover:border-primary-base",
							{
								"border-primary-base": revision.id === props.versionId(),
							},
						)}
						onClick={() => {
							navigate(
								`/admin/collections/${props.collectionKey()}/revisions/${props.documentId()}/${revision.id}`,
							);
						}}
					>
						<h3 class="mb-1">
							{T()("revision")} #{revision.id}
						</h3>
						<DateText date={revision.createdAt} />
						<div class="mt-15 flex gap-2.5">
							<Pill theme="secondary">Fields 0</Pill>
							<Pill theme="secondary">
								Bricks {revision.bricks?.builder?.length ?? 0}
							</Pill>
							<Pill theme="secondary">
								Fixed {revision.bricks?.fixed?.length ?? 0}
							</Pill>
						</div>
					</button>
				)}
			</For>
			{/* TODO: add pagination */}
			<Show when={props.revisions.length === 0}>
				{T()("no_revisions_found")}
			</Show>
		</aside>
	);
};
