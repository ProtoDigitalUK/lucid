import { Show, createMemo, type Component } from "solid-js";
import type { CollectionResponse } from "@protoheadless/core/types";
import { Link } from "@solidjs/router";
import { FaSolidBox, FaSolidBoxesStacked } from "solid-icons/fa";

interface CollectionCardProps {
	collection: CollectionResponse;
}

export const CollectionCardLoading: Component = () => {
	// ----------------------------------
	// Return
	return (
		<li class={"bg-container border-border border rounded-md p-15"}>
			<span class="skeleton block h-5 w-1/2 mb-2" />
			<span class="skeleton block h-5 w-full" />
		</li>
	);
};

const CollectionCard: Component<CollectionCardProps> = (props) => {
	// {props.collection.mode}
	// {props.collection.key}
	// {props.collection.documentId}

	// ----------------------------------------
	// Memos
	const collectionLink = createMemo(() => {
		if (props.collection.mode === "single") {
			if (props.collection.documentId)
				return `/collections/${props.collection.key}/${props.collection.documentId}`;
			return `/collections/${props.collection.key}/create`;
		}
		return `/collections/${props.collection.key}`;
	});

	// ----------------------------------------
	// Render
	return (
		<li class={""}>
			<Link
				class="border-border border h-full w-full p-15 rounded-md bg-container overflow-hidden cursor-pointer hover:border-secondary transition-colors duration-200 flex flex-col"
				href={collectionLink()}
			>
				<div class="flex items-center gap-1.5">
					<Show when={props.collection.mode === "single"}>
						<FaSolidBox class="text-base text-primary" />
					</Show>
					<Show when={props.collection.mode === "multiple"}>
						<FaSolidBoxesStacked class="text-base text-primary" />
					</Show>
					<h3 class="text-base">{props.collection.title}</h3>
				</div>

				{props.collection.description && (
					<p class="line-clamp-2 text-sm mt-1.5">
						{props.collection.description}
					</p>
				)}
			</Link>
		</li>
	);
};

export default CollectionCard;
