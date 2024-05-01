import { type Component, createMemo, For } from "solid-js";
import type { CollectionBrickConfigT } from "@protoheadless/core/types";
import brickStore, { type BrickData } from "@/store/brickStore";
import Builder from "@/components/Groups/Builder";

interface FixedBricksProps {
	brickConfig: CollectionBrickConfigT[];
}

export const FixedBricks: Component<FixedBricksProps> = (props) => {
	// ------------------------------
	// Memos
	const fixedBricks = createMemo(() =>
		brickStore.get.bricks
			.filter((brick) => brick.type === "fixed")
			.sort((a, b) => a.order - b.order),
	);

	// ----------------------------------
	// Render
	return (
		<ul>
			<For each={fixedBricks()}>
				{(brick) => (
					<FixedBrickRow
						brick={brick}
						brickConfig={props.brickConfig}
					/>
				)}
			</For>
		</ul>
	);
};

interface FixedBrickRowProps {
	brick: BrickData;
	brickConfig: CollectionBrickConfigT[];
}

const FixedBrickRow: Component<FixedBrickRowProps> = (props) => {
	// ------------------------------
	// Memos
	const config = createMemo(() => {
		return props.brickConfig.find((brick) => brick.key === props.brick.key);
	});

	return (
		<li class="w-full border-b border-border p-15 md:p-30">
			<div class="flex justify-between mb-15">
				<h2>{config()?.title}:</h2>
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
