import T from "@/translations/index";
import { Component, createMemo, createSignal } from "solid-js";
import { FaSolidRobot } from "solid-icons/fa";
// Types
import type { BrickConfigT } from "@headless/types/src/bricks";
import type { CollectionResT } from "@headless/types/src/collections";
// Components
import Button from "@/components/Partials/Button";
import AddBrick from "@/components/Modals/Bricks/AddBrick";

interface TopBarProps {
	state: {
		brickConfig?: BrickConfigT[];
		collection?: CollectionResT;
	};
}

export const TopBar: Component<TopBarProps> = (props) => {
	// ------------------------------
	// State
	const [getSelectBrickOpen, setSelectBrickOpen] = createSignal(false);

	// ------------------------------
	// Memos
	const hasBuilderBricks = createMemo(() => {
		return props.state.collection?.bricks?.some(
			(brick) => brick.type === "builder",
		);
	});

	// ----------------------------------
	// Render
	return (
		<>
			<div class="h-[40px] w-full mb-15 flex items-center">
				<Button
					type="button"
					theme="primary"
					size="small"
					onClick={() => {
						setSelectBrickOpen(true);
					}}
					disabled={!hasBuilderBricks()}
				>
					{T("add_brick")}
				</Button>
				<button
					class="h-10 w-10 rounded-full ml-2.5 bg-secondary flex items-center justify-center fill-white text-xl hover:bg-secondaryH duration-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
					disabled
					type="button"
				>
					<FaSolidRobot />
				</button>
			</div>
			<AddBrick
				state={{
					open: getSelectBrickOpen(),
					setOpen: setSelectBrickOpen,
				}}
				data={{
					collection: props.state.collection,
					brickConfig: props.state.brickConfig || [],
				}}
			/>
		</>
	);
};
