import { type Component, createMemo, For, createSignal, Show } from "solid-js";
import type { CollectionBrickConfigT } from "@lucidcms/core/types";
import classNames from "classnames";
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
	// -------------------------------
	// State
	const [getBrickOpen, setBrickOpen] = createSignal(!!props.brick.open);

	// ------------------------------
	// Memos
	const config = createMemo(() => {
		return props.brickConfig.find((brick) => brick.key === props.brick.key);
	});

	// -------------------------------
	// Functions
	const toggleDropdown = () => {
		setBrickOpen(!getBrickOpen());
		// TODO: sync with brick store item
	};

	return (
		<li class="w-full border-b border-border p-15 md:p-30">
			<div
				class={classNames("flex justify-between cursor-pointer", {
					"mb-15": getBrickOpen(),
				})}
				onClick={toggleDropdown}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						toggleDropdown();
					}
				}}
			>
				<h2>{config()?.title}:</h2>
				<button
					type="button"
					class={classNames("text-2xl", {
						"transform rotate-180": getBrickOpen(),
					})}
				>
					^
				</button>
			</div>
			<Show when={getBrickOpen()}>
				<Builder.BrickBody
					state={{
						brick: props.brick,
						configFields: config()?.fields || [],
					}}
				/>
			</Show>
		</li>
	);
};
