import { type Component, For, createSignal, createMemo, Show } from "solid-js";
import { FaSolidMagnifyingGlass, FaSolidXmark } from "solid-icons/fa";
import classNames from "classnames";
// Types
import type { BrickConfigT } from "@headless/types/src/bricks";
import type { CollectionResT } from "@headless/types/src/collections";
import brickIcon from "@/assets/svgs/default-brick-icon.svg";
// Store
import builderStore from "@/store/builderStore";
// Components
import Modal from "@/components/Groups/Modal";
import BrickPreview from "@/components/Partials/BrickPreview";

interface AddBrickProps {
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
	data: {
		collection?: CollectionResT;
		brickConfig: BrickConfigT[];
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
		return props.data.brickConfig
			.filter((brickConfig) => {
				const collectionBrick = props.data.collection?.bricks.find(
					(collectionBrick) =>
						collectionBrick.key === brickConfig.key,
				);
				if (!collectionBrick) return false;

				if (collectionBrick.type === "builder") return true;
				return false;
			})
			.filter((brickConfig) => {
				if (!getSearchQuery()) return true;
				return brickConfig.title
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
					<FaSolidMagnifyingGlass class="w-15 fill-unfocused" />
				</div>
				<input
					class="h-full w-full border-b border-border px-10 focus:outline-none text-title placeholder:text-unfocused"
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
						<FaSolidXmark class="w-15 fill-error" />
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
												"bg-backgroundAccent":
													brickConfig.key ===
													getHighlightedBrick(),
												"bg-container":
													brickConfig.key !==
													getHighlightedBrick(),
											},
										)}
										onMouseOver={() =>
											setHighlightedBrick(brickConfig.key)
										}
										onFocus={() =>
											setHighlightedBrick(brickConfig.key)
										}
										onClick={() => {
											builderStore.get.addBrick({
												brick: {
													key: brickConfig.key,
													type: "builder",
													fields: [],
													groups: [],
												},
											});
											props.state.setOpen(false);
										}}
										type="button"
									>
										<img
											src={brickIcon}
											alt={brickConfig.title}
											class="w-6 mr-2.5"
										/>
										{brickConfig.title}
									</button>
								</li>
							)}
						</For>
					</ul>
				</div>
				{/* Preview */}
				<div class="w-[60%] p-15 h-full pl-0">
					<div class="bg-backgroundAccent h-full rounded-md flex items-center justify-center">
						<div class="w-[80%]">
							<BrickPreview
								data={{
									brick: highlightedBrick(),
								}}
								options={{
									rounded: true,
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</Modal.Root>
	);
};

export default AddBrick;
