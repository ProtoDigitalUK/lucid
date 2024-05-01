import { type Component, createMemo, For, Show } from "solid-js";
import type { CollectionBrickConfigT } from "@protoheadless/core/types";
import brickStore, { type BrickData } from "@/store/brickStore";
import Builder from "@/components/Groups/Builder";

interface BuilderBricksProps {
	brickConfig: CollectionBrickConfigT[];
}

export const BuilderBricks: Component<BuilderBricksProps> = (props) => {
	// ------------------------------
	// Memos
	const builderBricks = createMemo(() =>
		brickStore.get.bricks
			.filter((brick) => brick.type === "builder")
			.sort((a, b) => a.order - b.order),
	);

	// ----------------------------------
	// Render
	return (
		<Show when={props.brickConfig.length > 0}>
			<div class="p-15 md:p-30">
				<div class="flex justify-between mb-15">
					<h2>Builder Area:</h2>
					<button type="button">Add Brick</button>
				</div>
				<ul class="bg-backgroundAccent p-15 rounded-md border border-border">
					<For each={builderBricks()}>
						{(brick) => (
							<BuilderBrickRow
								brick={brick}
								brickConfig={props.brickConfig}
							/>
						)}
					</For>
				</ul>
			</div>
		</Show>
	);
};

interface BuilderBrickRowProps {
	brick: BrickData;
	brickConfig: CollectionBrickConfigT[];
}

const BuilderBrickRow: Component<BuilderBrickRowProps> = (props) => {
	// ------------------------------
	// Memos
	const config = createMemo(() => {
		return props.brickConfig.find((brick) => brick.key === props.brick.key);
	});

	return (
		<li class="w-full bg-white border border-border p-15">
			<div class="flex justify-between mb-15">
				<h3>{config()?.title}</h3>
				<button type="button">^</button>
			</div>
			<Builder.BrickBody
				state={{
					brick: props.brick,
					configFields: config()?.fields || [],
				}}
			/>
		</li>
	);
};
