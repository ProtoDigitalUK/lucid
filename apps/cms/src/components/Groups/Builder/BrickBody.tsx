import { type Component, Show, createMemo, For } from "solid-js";
import type { CollectionBrickConfigT } from "@protoheadless/core/types";
import type { BrickData } from "@/store/brickStore";

interface BrickProps {
	state: {
		brick: BrickData;
		configFields: CollectionBrickConfigT["fields"];
	};
}

export const BrickBody: Component<BrickProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<For each={props.state.configFields}>
			{(field) => (
				<>
					({field.type} - {field.key})
				</>
			)}
		</For>
	);
};
