import { Show, createMemo, type Component } from "solid-js";
import type { CollectionResponse } from "@lucidcms/core/types";
import { A } from "@solidjs/router";
import { FaSolidBox, FaSolidBoxesStacked } from "solid-icons/fa";

interface CollectionCardProps {
	collection: CollectionResponse;
}

export const CollectionCardLoading: Component = () => {
	// ----------------------------------
	// Return
	return (
		<li class={"bg-container-2 border-border border rounded-md p-15"}>
			<span class="skeleton block h-5 w-1/2 mb-2" />
			<span class="skeleton block h-5 w-full" />
		</li>
	);
};

const CollectionCard: Component<CollectionCardProps> = (props) => {
	// ----------------------------------------
	// Memos
	const collectionLink = createMemo(() => {
		if (props.collection.mode === "single") {
			if (props.collection.documentId)
				return `/admin/collections/${props.collection.key}/${props.collection.documentId}`;
			return `/admin/collections/${props.collection.key}/create`;
		}
		return `/admin/collections/${props.collection.key}`;
	});

	// ----------------------------------------
	// Render
	return (
		<li class={""}>
			<A
				class="border-border border h-full w-full p-15 rounded-md bg-container-2 overflow-hidden cursor-pointer hover:border-primary-base transition-colors duration-200 flex flex-col"
				href={collectionLink()}
			>
				<div class="flex items-center gap-1.5">
					<Show when={props.collection.mode === "single"}>
						<FaSolidBox class="text-base text-primary-base" />
					</Show>
					<Show when={props.collection.mode === "multiple"}>
						<FaSolidBoxesStacked class="text-base text-primary-base" />
					</Show>
					<h3 class="text-base">{props.collection.title}</h3>
				</div>

				{props.collection.description && (
					<p class="line-clamp-2 text-sm mt-1.5">
						{props.collection.description}
					</p>
				)}
			</A>
		</li>
	);
};

export default CollectionCard;
