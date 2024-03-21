import { type Component, For, createMemo, Show } from "solid-js";
// Types
import type { BrickConfigT } from "@headless/types/src/bricks";
// Stores
import builderStore from "@/store/builderStore";
// Components
import BrickPreview from "@/components/Partials/BrickPreview";
import DragDrop, { type DragDropCBT } from "@/components/Partials/DragDrop";
import classNames from "classnames";

interface PreviewBarProps {
	data: {
		brickConfig: BrickConfigT[];
	};
}

export const PreviewBar: Component<PreviewBarProps> = (props) => {
	// ----------------------------------
	// Memos
	const builderBricks = createMemo(() =>
		builderStore.get.bricks
			.filter((brick) => brick.type === "builder")
			.sort((a, b) => a.order - b.order),
	);
	const fixedBricks = createMemo(() =>
		builderStore.get.bricks
			.filter((brick) => brick.type === "fixed")
			.sort((a, b) => a.order - b.order),
	);

	const topFixedBricks = createMemo(() =>
		fixedBricks().filter((brick) => brick.position === "top"),
	);
	const bottomFixedBricks = createMemo(() =>
		fixedBricks().filter((brick) => brick.position === "bottom"),
	);

	// ----------------------------------
	// Render
	return (
		<>
			{/* Fixed - Top */}
			<Show when={topFixedBricks().length > 0}>
				<ul class="mb-2.5">
					<For each={topFixedBricks()}>
						{(brick) => (
							<PreviewBarItem
								type="fixed"
								data={{
									key: brick.key,
									brickConfig: props.data.brickConfig,
									brickId: brick.id,
								}}
							/>
						)}
					</For>
				</ul>
			</Show>
			{/* Builder */}
			<div>
				<Show
					when={
						topFixedBricks().length > 0 &&
						builderBricks().length > 0
					}
				>
					<span class="w-10 h-px bg-white block mx-auto my-2.5" />
				</Show>
				<DragDrop
					sortOrder={(id, targetid) => {
						builderStore.get.sortOrder({
							from: id,
							to: targetid,
						});
					}}
				>
					{({ dragDrop }) => (
						<ol class="w-full">
							<For each={builderBricks()}>
								{(brick) => (
									<PreviewBarItem
										type="builder"
										data={{
											key: brick.key,
											brickConfig: props.data.brickConfig,
											brickId: brick.id,
										}}
										callbacks={{ dragDrop }}
									/>
								)}
							</For>
						</ol>
					)}
				</DragDrop>
				<Show
					when={
						bottomFixedBricks().length > 0 &&
						builderBricks().length > 0
					}
				>
					<span class="w-10 h-px bg-white block mx-auto my-2.5" />
				</Show>
			</div>
			{/* Fixed - Bottom */}
			<Show when={bottomFixedBricks().length > 0}>
				<ul>
					<For each={bottomFixedBricks()}>
						{(brick) => (
							<PreviewBarItem
								type="fixed"
								data={{
									key: brick.key,
									brickConfig: props.data.brickConfig,
									brickId: brick.id,
								}}
							/>
						)}
					</For>
				</ul>
			</Show>
		</>
	);
};

interface PreviewBarItemProps {
	type: "builder" | "fixed";
	data: {
		key: string;
		brickConfig: BrickConfigT[];
		brickId: number | string;
	};
	callbacks?: {
		dragDrop?: DragDropCBT;
	};
}

const PreviewBarItem: Component<PreviewBarItemProps> = (props) => {
	// ------------------------------
	// Memos
	const brickConfig = createMemo(() => {
		return props.data.brickConfig.find(
			(brick) => brick.key === props.data.key,
		);
	});
	const repeaterKey = createMemo(() => {
		return "pagebuilder-preview";
	});

	// ------------------------------
	// Functions
	const onClickHandler = () => {
		const brickEle = document.querySelector(
			`#accordion-${props.data.brickId}`,
		) as HTMLElement;
		if (brickEle) {
			brickEle.click();
			brickEle.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}
	};

	// ----------------------------------
	// Render
	return (
		<li
			data-brickId={props.data.brickId}
			class={classNames(
				"mb-2 last:mb-0 transition-all duration-200 rounded-md overflow-hidden border border-transparent cursor-pointer",
				{
					"opacity-60":
						props.callbacks?.dragDrop?.getDragging()?.index ===
						props.data.brickId,
					"!border-secondary":
						props.callbacks?.dragDrop?.getDraggingTarget()
							?.index === props.data.brickId,
					"cursor-grab": props.type === "builder",
				},
			)}
			data-dragkey={repeaterKey()}
			onDragStart={(e) =>
				props.callbacks?.dragDrop?.onDragStart(e, {
					index: props.data.brickId,
					key: repeaterKey(),
				})
			}
			onDragEnd={(e) => props.callbacks?.dragDrop?.onDragEnd(e)}
			onDragEnter={(e) =>
				props.callbacks?.dragDrop?.onDragEnter(e, {
					index: props.data.brickId,
					key: repeaterKey(),
				})
			}
			onDragOver={(e) => props.callbacks?.dragDrop?.onDragOver(e)}
			draggable={props.type === "builder"}
			onClick={onClickHandler}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onClickHandler();
				}
			}}
		>
			<BrickPreview
				data={{
					brick: brickConfig(),
				}}
			/>
			<div class="bg-primaryA2 px-2.5 py-1 text-center">
				<h3 class="text-sm text-white">{brickConfig()?.title}</h3>
			</div>
		</li>
	);
};
