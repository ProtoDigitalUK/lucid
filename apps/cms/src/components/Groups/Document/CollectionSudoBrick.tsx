import { type Component, createMemo, Show } from "solid-js";
import type { CustomField } from "@lucidcms/core/types";
import brickStore, { type BrickData } from "@/store/brickStore";
import Builder from "@/components/Groups/Builder";

interface CollectionSudoBrickProps {
	fields: CustomField[];
}

export const CollectionSudoBrick: Component<CollectionSudoBrickProps> = (
	props,
) => {
	// ------------------------------
	// Memos
	const collectionSudoBrick = createMemo(() => {
		const bricks = brickStore.get.bricks.filter(
			(b) => b.type === "collection-fields",
		);
		return bricks.length > 0 ? bricks[0] : undefined;
	});
	const brickIndex = createMemo(() => {
		return brickStore.get.bricks.findIndex(
			(brick) => brick.id === collectionSudoBrick()?.id,
		);
	});

	// ----------------------------------
	// Render
	return (
		<Show when={collectionSudoBrick() !== undefined}>
			<div class="px-15 md:px-30 pb-15 md:pb-30">
				<Builder.BrickBody
					state={{
						open: true,
						brick: collectionSudoBrick() as BrickData,
						brickIndex: brickIndex(),
						configFields: props.fields,
					}}
				/>
			</div>
		</Show>
	);
};
