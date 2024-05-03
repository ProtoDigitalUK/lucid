import T from "@/translations/index";
import classNames from "classnames";
import { type Component, type Accessor, type Setter, For } from "solid-js";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
import type { CustomField } from "@protoheadless/core/types";
import CustomFields from "@/components/Groups/Builder/CustomFields";

interface GroupBodyProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupIndex: number;
		getFieldPath: Accessor<string[]>;
		setFieldPath: Setter<string[]>;
		getGroupIndexes: Accessor<number[]>;
		setGroupIndexes: Setter<number[]>;
	};
}

export const GroupBody: Component<GroupBodyProps> = (props) => {
	// -------------------------------
	// Functions
	const removeGroup = (groupIndex: number) => {};

	// -------------------------------
	// Render
	return (
		<div class={classNames("w-full flex", {})}>
			{/* Group Items */}
			<div
				class={classNames(
					"bg-background border-border border mb-2.5 flex last:mb-0 rounded-md w-full duration-200 transition-colors",
					{
						"bg-white":
							props.state.getGroupIndexes().length % 2 !== 0,
					},
				)}
			>
				<div class="w-5 h-full bg-backgroundAccent hover:bg-backgroundAccentH transition-colors duration-200 flex items-center justify-center cursor-grab">
					<FaSolidGripLines class="fill-title w-3" />
				</div>
				<div class="p-15 w-full">
					<For each={props.state.field.fields}>
						{(field) => (
							<CustomFields.DynamicField
								state={{
									brickIndex: props.state.brickIndex,
									field: field,
									groupIndex: props.state.groupIndex,
									getFieldPath: props.state.getFieldPath,
									setFieldPath: props.state.setFieldPath,
									getGroupIndexes:
										props.state.getGroupIndexes,
									setGroupIndexes:
										props.state.setGroupIndexes,
								}}
							/>
						)}
					</For>
				</div>
			</div>
			{/* Group Action Bar */}
			<div class={"ml-2.5 transition-opacity duration-200"}>
				<button
					type="button"
					class="fill-primary hover:fill-errorH bg-transparent transition-colors duration-200 cursor-pointer"
					onClick={() => {
						removeGroup(props.state.groupIndex);
					}}
					aria-label={T("remove_entry")}
				>
					<FaSolidTrashCan class="w-4" />
				</button>
			</div>
		</div>
	);
};
