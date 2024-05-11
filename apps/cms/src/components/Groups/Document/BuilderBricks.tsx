import T from "@/translations";
import { type Component, createMemo, For, Show, createSignal } from "solid-js";
import type { CollectionBrickConfig } from "@lucidcms/core/types";
import { FaSolidCircleChevronUp } from "solid-icons/fa";
import classNames from "classnames";
import brickStore, { type BrickData } from "@/store/brickStore";
import Builder from "@/components/Groups/Builder";
import Button from "@/components/Partials/Button";
import AddBrick from "@/components/Modals/Bricks/AddBrick";

interface BuilderBricksProps {
	brickConfig: CollectionBrickConfig[];
}

export const BuilderBricks: Component<BuilderBricksProps> = (props) => {
	// ------------------------------
	// State
	const [getSelectBrickOpen, setSelectBrickOpen] = createSignal(false);

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
					<Button
						type="button"
						theme="primary"
						size="x-small"
						onClick={() => {
							setSelectBrickOpen(true);
						}}
					>
						{T("add_brick")}
					</Button>
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

			<AddBrick
				state={{
					open: getSelectBrickOpen(),
					setOpen: setSelectBrickOpen,
				}}
				data={{
					brickConfig: props.brickConfig,
				}}
			/>
		</Show>
	);
};

interface BuilderBrickRowProps {
	brick: BrickData;
	brickConfig: CollectionBrickConfig[];
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

	// -------------------------------
	// Render
	return (
		<li class="w-full bg-container-2 border border-border rounded-md mb-15 last:mb-0">
			<div
				class={classNames(
					"flex items-center justify-between cursor-pointer px-15 py-2.5 focus:outline-none focus:ring-1 rounded-md ring-inset ring-primary-base",
					{
						"mb-15": getBrickOpen(),
					},
				)}
				onClick={toggleDropdown}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						toggleDropdown();
					}
				}}
				id={`builder-brick-${props.brick.key}`}
				aria-expanded={getBrickOpen()}
				aria-controls={`bulder-brick-content-${props.brick.key}`}
				role="button"
				tabIndex="0"
			>
				<h3>{config()?.title}</h3>
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
			<Builder.BrickBody
				state={{
					open: getBrickOpen(),
					brick: props.brick,
					brickIndex: brickIndex(),
					configFields: config()?.fields || [],
					labelledby: `builder-brick-${props.brick.key}`,
				}}
				options={{
					padding: "15",
				}}
			/>
		</li>
	);
};
