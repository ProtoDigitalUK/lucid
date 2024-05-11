import { type Component, createMemo, For, createSignal } from "solid-js";
import type { CollectionBrickConfig } from "@lucidcms/core/types";
import classNames from "classnames";
import { FaSolidCircleChevronUp } from "solid-icons/fa";
import brickStore, { type BrickData } from "@/store/brickStore";
import Builder from "@/components/Groups/Builder";

interface FixedBricksProps {
	brickConfig: CollectionBrickConfig[];
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
	brickConfig: CollectionBrickConfig[];
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
	const brickIndex = createMemo(() => {
		return brickStore.get.bricks.findIndex(
			(brick) => brick.id === props.brick.id,
		);
	});

	// -------------------------------
	// Functions
	const toggleDropdown = () => {
		setBrickOpen(!getBrickOpen());
		brickStore.get.toggleBrickOpen(brickIndex());
	};

	return (
		<li class="w-full border-b border-border">
			{/* Header */}
			<div
				class={
					"flex justify-between cursor-pointer p-15 md:p-30 focus:outline-none focus:ring-1 ring-inset ring-primary-base"
				}
				onClick={toggleDropdown}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						toggleDropdown();
					}
				}}
				id={`fixed-brick-${props.brick.key}`}
				aria-expanded={getBrickOpen()}
				aria-controls={`fixed-brick-content-${props.brick.key}`}
				role="button"
				tabIndex="0"
			>
				<h2>{config()?.title}:</h2>
				<button
					type="button"
					tabIndex="-1"
					class={classNames(
						"text-2xl text-icon-base hover:text-icon-hover transition-all duration-200",
						{
							"transform rotate-180": getBrickOpen(),
						},
					)}
				>
					<FaSolidCircleChevronUp size={16} />
				</button>
			</div>
			{/* Body */}
			<Builder.BrickBody
				state={{
					open: getBrickOpen(),
					brick: props.brick,
					brickIndex: brickIndex(),
					configFields: config()?.fields || [],
					labelledby: `fixed-brick-${props.brick.key}`,
				}}
				options={{
					padding: "30",
					bleedTop: true,
				}}
			/>
		</li>
	);
};
