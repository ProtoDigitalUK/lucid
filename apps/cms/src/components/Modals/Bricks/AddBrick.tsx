import { type Component, For, createSignal, createMemo, Show } from "solid-js";
import { FaSolidMagnifyingGlass, FaSolidXmark } from "solid-icons/fa";
import classNames from "classnames";
import type { CollectionBrickConfig } from "@lucidcms/core/types";
import brickIcon from "@/assets/svgs/default-brick-icon-white.svg";
import brickStore from "@/store/brickStore";
import helpers from "@/utils/helpers";
import Modal from "@/components/Groups/Modal";
import BrickPreview from "@/components/Partials/BrickPreview";
import Tooltip from "@/components/Partials/Tooltip";

interface AddBrickProps {
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
	data: {
		brickConfig: CollectionBrickConfig[];
	};
}

const AddBrick: Component<AddBrickProps> = (props) => {
	// ------------------------------
	// State
	const [getHighlightedBrick, setHighlightedBrick] = createSignal<
		string | undefined
	>(undefined);

	const [getSearchQuery, setSearchQuery] = createSignal<string>("");

	// ------------------------------
	// Memos
	const brickList = createMemo(() => {
		return props.data.brickConfig.filter((brickConfig) => {
			if (!getSearchQuery()) return true;
			return helpers
				.getLocaleValue({
					value: brickConfig.title,
					fallback: brickConfig.key,
				})
				.toLowerCase()
				.includes(getSearchQuery().toLowerCase());
		});
	});

	const highlightedBrick = createMemo(() => {
		const highlighted = props.data.brickConfig.find(
			(brickConfig) => brickConfig.key === getHighlightedBrick(),
		);
		if (!highlighted) {
			const brickListd = brickList();
			if (brickListd.length > 0) {
				setHighlightedBrick(brickListd[0].key);
			}
		}
		return highlighted;
	});

	// ------------------------------
	// Render
	return (
		<Modal.Root
			state={{
				open: props.state.open,
				setOpen: props.state.setOpen,
			}}
			options={{
				noPadding: true,
			}}
		>
			{/* Search */}
			<div class="h-14 w-full relative">
				<div class="absolute top-0 left-15 h-full flex items-center justify-center pointer-events-none">
					<FaSolidMagnifyingGlass class="w-15 text-unfocused" />
				</div>
				<input
					class="h-full bg-container-3 w-full border-b border-border px-10 focus:outline-none text-title placeholder:text-unfocused"
					placeholder="search"
					value={getSearchQuery()}
					onInput={(e) => setSearchQuery(e.currentTarget.value)}
				/>
				<Show when={getSearchQuery()}>
					<button
						class="absolute top-0 right-15 h-full flex items-center justify-center cursor-pointer"
						onClick={() => {
							setSearchQuery("");
						}}
						type="button"
					>
						<FaSolidXmark class="w-15 text-error-base" />
					</button>
				</Show>
			</div>
			{/* Content */}
			<div class="flex h-96">
				{/* Options */}
				<div class="w-[40%] p-15 overflow-y-auto h-full">
					<ul class="h-full w-full">
						<For each={brickList()}>
							{(brickConfig) => (
								<li class="w-full">
									<button
										class={classNames(
											"flex items-center font-medium w-full p-2.5 rounded-md transition-colors duration-200",
											{
												"bg-container-2":
													brickConfig.key === getHighlightedBrick(),
												"bg-container-3":
													brickConfig.key !== getHighlightedBrick(),
											},
										)}
										onMouseOver={() => setHighlightedBrick(brickConfig.key)}
										onFocus={() => setHighlightedBrick(brickConfig.key)}
										onClick={() => {
											brickStore.get.addBrick({
												brickConfig: brickConfig,
											});
											props.state.setOpen(false);
										}}
										type="button"
									>
										<img
											src={brickIcon}
											alt={brickConfig.key}
											class="w-6 mr-2.5"
											loading="lazy"
										/>
										{helpers.getLocaleValue({
											value: brickConfig.title,
											fallback: brickConfig.key,
										})}
									</button>
								</li>
							)}
						</For>
					</ul>
				</div>
				{/* Preview */}
				<div class="w-[60%] p-15 h-full pl-0">
					<div class="border border-border h-full rounded-md flex items-center justify-center relative">
						<div class="w-[80%]">
							<BrickPreview
								data={{
									brick: {
										title: helpers.getLocaleValue({
											value: highlightedBrick()?.title,
											fallback: highlightedBrick()?.key,
										}),
										image: highlightedBrick()?.preview?.image,
									},
								}}
								options={{
									rounded: true,
								}}
							/>
						</div>
						<Show when={highlightedBrick()?.description}>
							<Tooltip
								copy={helpers.getLocaleValue({
									value: highlightedBrick()?.description,
									fallback: highlightedBrick()?.key,
								})}
							/>
						</Show>
					</div>
				</div>
			</div>
		</Modal.Root>
	);
};

export default AddBrick;
