import { type Component, For, createMemo } from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import brickStore, { type BrickData } from "@/store/brickStore";
import CustomFields from "./CustomFields";

interface BrickProps {
	state: {
		brick: BrickData;
		configFields: CustomField[];
	};
}

export const BrickBody: Component<BrickProps> = (props) => {
	// ----------------------------------
	// Memos
	const brickIndex = createMemo(() => {
		return brickStore.get.bricks.findIndex(
			(brick) => brick.id === props.state.brick.id,
		);
	});

	// ----------------------------------
	// Render
	return (
		<For each={props.state.configFields}>
			{(field) => (
				<CustomFields.DynamicField
					state={{
						brickIndex: brickIndex(),
						field: field,
					}}
				/>
			)}
		</For>
	);
};
