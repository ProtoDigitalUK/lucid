import { type Component, createMemo, For, Show, createSignal } from "solid-js";
import type { CollectionBrickConfigT } from "@lucidcms/core/types";
import classNames from "classnames";
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
				<ol class="">
					<For each={builderBricks()}>
						{(brick) => (
							<BuilderBrickRow
								brick={brick}
								brickConfig={props.brickConfig}
							/>
						)}
					</For>
				</ol>
			</div>
		</Show>
	);
};

interface BuilderBrickRowProps {
	brick: BrickData;
	brickConfig: CollectionBrickConfigT[];
}

const BuilderBrickRow: Component<BuilderBrickRowProps> = (props) => {
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

	// -------------------------------
	// Render
	return (
		<li class="w-full bg-container-2 border border-border p-15 rounded-md">
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
				<h3>{config()?.title}</h3>
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
