import T from "@/translations/index";
import classNames from "classnames";
import {
	type Component,
	type Accessor,
	type Setter,
	For,
	createMemo,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
import brickStore from "@/store/brickStore";
import CustomFields from "@/components/Groups/Builder/CustomFields";

interface GroupBodyProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId: number | string;
		getFieldPath: Accessor<string[]>;
		setFieldPath: Setter<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
		setGroupPath: Setter<Array<string | number>>;
	};
}

export const GroupBody: Component<GroupBodyProps> = (props) => {
	// -------------------------------
	// Memos
	const groupId = createMemo(() => props.state.groupId);
	const brickIndex = createMemo(() => props.state.brickIndex);
	const fields = createMemo(() => props.state.field.fields);

	// -------------------------------
	// Functions
	const removeGroup = (groupId: number | string) => {
		brickStore.get.removeRepeaterGroup({
			brickIndex: brickIndex(),
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			groupId: groupId,
		});
	};

	// -------------------------------
	// Render
	return (
		<div class={classNames("w-full flex", {})}>
			{/* Group Items */}
			<div
				class={classNames(
					"bg-background border-border border mb-2.5 flex last:mb-0 rounded-md w-full duration-200 transition-colors",
					{
						"bg-white": props.state.getGroupPath().length % 2 !== 0,
					},
				)}
			>
				<div class="w-5 h-full bg-backgroundAccent hover:bg-backgroundAccentH transition-colors duration-200 flex items-center justify-center cursor-grab">
					<FaSolidGripLines class="text-title w-3" />
				</div>
				<div class="p-15 w-full">
					<For each={fields()}>
						{(field) => (
							<CustomFields.DynamicField
								state={{
									brickIndex: brickIndex(),
									field: field,
									groupId: groupId(),
									getFieldPath: props.state.getFieldPath,
									setFieldPath: props.state.setFieldPath,
									getGroupPath: props.state.getGroupPath,
									setGroupPath: props.state.setGroupPath,
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
					class="text-primary hover:text-errorH bg-transparent transition-colors duration-200 cursor-pointer"
					onClick={() => {
						removeGroup(groupId());
					}}
					aria-label={T("remove_entry")}
				>
					<FaSolidTrashCan class="w-4" />
				</button>
			</div>
		</div>
	);
};
