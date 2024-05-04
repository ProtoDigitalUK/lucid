import T from "@/translations/index";
import classNames from "classnames";
import {
	type Component,
	type Accessor,
	type Setter,
	For,
	createMemo,
	createSignal,
	Show,
} from "solid-js";
import type { DragDropCBT } from "@/components/Partials/DragDrop";
import type { CustomField } from "@lucidcms/core/types";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
import brickStore from "@/store/brickStore";
import CustomFields from "@/components/Groups/Builder/CustomFields";

interface GroupBodyProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId: number | string;
		dragDrop: DragDropCBT;
		repeaterKey: string;
		groupIndex: number;
		getFieldPath: Accessor<string[]>;
		setFieldPath: Setter<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
		setGroupPath: Setter<Array<string | number>>;
	};
}

export const GroupBody: Component<GroupBodyProps> = (props) => {
	// -------------------------------
	// State
	const [getGroupOpen, setGroupOpen] = createSignal(false);

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
		<div
			data-dragkey={props.state.repeaterKey}
			class={classNames("w-full", {
				"opacity-60":
					props.state.dragDrop.getDragging()?.index === groupId(),
				"mb-2.5": props.state.getGroupPath().length > 0,
				"mb-15": props.state.getGroupPath().length === 0,
			})}
			onDragStart={(e) =>
				props.state.dragDrop.onDragStart(e, {
					index: groupId(),
					key: props.state.repeaterKey,
				})
			}
			onDragEnd={(e) => props.state.dragDrop.onDragEnd(e)}
			onDragEnter={(e) =>
				props.state.dragDrop.onDragEnter(e, {
					index: groupId(),
					key: props.state.repeaterKey,
				})
			}
			onDragOver={(e) => props.state.dragDrop.onDragOver(e)}
		>
			{/* Group Header */}
			<div
				class={classNames(
					"w-full bg-container-4 cursor-pointer rounded-md border border-border flex justify-between items-center",
					{
						"p-2": props.state.getGroupPath().length > 0,
						"p-15": props.state.getGroupPath().length === 0,
						"border-b-0 rounded-b-none": getGroupOpen(),
					},
				)}
				onClick={() => setGroupOpen(!getGroupOpen())}
				onKeyPress={() => setGroupOpen(!getGroupOpen())}
			>
				<div class="flex items-center">
					<button
						type="button"
						class="text-icon-base mr-2 hover:text-primary-hover transition-colors duration-200 cursor-pointer"
						onDragStart={(e) =>
							props.state.dragDrop.onDragStart(e, {
								index: groupId(),
								key: props.state.repeaterKey,
							})
						}
						onDragEnd={(e) => props.state.dragDrop.onDragEnd(e)}
						onDragEnter={(e) =>
							props.state.dragDrop.onDragEnter(e, {
								index: groupId(),
								key: props.state.repeaterKey,
							})
						}
						onDragOver={(e) => props.state.dragDrop.onDragOver(e)}
						draggable={true}
						aria-label={T("change_order")}
					>
						<FaSolidGripLines class="w-4" />
					</button>
					<h3 class="text-sm text-body">
						{props.state.field.title}-{props.state.groupIndex + 1}
					</h3>
				</div>
				<button
					type="button"
					class="text-icon-base hover:text-error-hover transition-colors duration-200 cursor-pointer"
					onClick={() => {
						removeGroup(groupId());
					}}
					aria-label={T("remove_entry")}
				>
					<FaSolidTrashCan class="w-4" />
				</button>
			</div>
			{/* Group Body */}
			<Show when={getGroupOpen()}>
				<div
					class={classNames(
						"border-border p-15 border-x border-b mb-2.5 last:mb-0 rounded-b-md overflow-hidden w-full duration-200 transition-colors",
						{
							// "bg-container-3":
							// 	props.state.getGroupPath().length % 2 !== 0,
						},
					)}
				>
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
			</Show>
		</div>
	);
};
