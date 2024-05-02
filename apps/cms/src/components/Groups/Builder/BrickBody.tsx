import { type Component, For } from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import type { BrickData } from "@/store/brickStore";
import CustomFields from "./CustomFields";

interface BrickProps {
	state: {
		brick: BrickData;
		configFields: CustomField[];
	};
}

export const BrickBody: Component<BrickProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<For each={props.state.configFields}>
			{(field) => (
				<CustomFields.DynamicField
					state={{
						field: field,
					}}
				/>
			)}
		</For>
	);
};
