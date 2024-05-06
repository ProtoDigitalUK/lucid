import T from "@/translations/index";
import classNames from "classnames";
import { type Component, For, createMemo, createSignal, Show } from "solid-js";
import type { DragDropCBT } from "@/components/Partials/DragDrop";
import type { CustomField, FieldResponse } from "@lucidcms/core/types";
import { FaSolidGripLines, FaSolidTrashCan } from "solid-icons/fa";
import brickStore from "@/store/brickStore";
import CustomFields from "@/components/Groups/Builder/CustomFields";

interface GroupBodyProps {
	state: {
		brickIndex: number;
		fields: FieldResponse[];
		fieldConfig: CustomField;
		groupId: number | string;
		groupOpen: 1 | 0 | null;
		dragDrop: DragDropCBT;
		repeaterKey: string;
		dragDropKey: string;
		groupIndex: number;
		repeaterDepth: number;
	};
}

export const GroupBody: Component<GroupBodyProps> = (props) => {
	// -------------------------------
	// State
	const [getGroupOpen, setGroupOpen] = createSignal(!!props.state.groupOpen);

	// -------------------------------
	// Memos
	const groupId = createMemo(() => props.state.groupId);
	const brickIndex = createMemo(() => props.state.brickIndex);
	const configChildrenFields = createMemo(
		() => props.state.fieldConfig.fields,
	);
	const nextRepeaterDepth = createMemo(() => props.state.repeaterDepth + 1);
	const groupFields = createMemo(() => {
		return props.state.fields;
	});

	// -------------------------------
	// Functions
	const toggleDropdown = () => {
		setGroupOpen(!getGroupOpen());
		// TODO: sync with group store item
	};
	const removeGroup = (groupId: number | string) => {
		brickStore.get.removeRepeaterGroup({
			brickIndex: brickIndex(),
			repeaterKey: props.state.repeaterKey,
			groupId: groupId,
		});
	};

	// -------------------------------
	// Render
	return (
		<div
			data-dragkey={props.state.dragDropKey}
			class={classNames("w-full", {
				"opacity-60":
					props.state.dragDrop.getDragging()?.index === groupId(),
				"mb-2.5": props.state.repeaterDepth > 0,
				"mb-15": props.state.repeaterDepth === 0,
			})}
			onDragStart={(e) =>
				props.state.dragDrop.onDragStart(e, {
					index: groupId(),
					key: props.state.dragDropKey,
				})
			}
			onDragEnd={(e) => props.state.dragDrop.onDragEnd(e)}
			onDragEnter={(e) =>
				props.state.dragDrop.onDragEnter(e, {
					index: groupId(),
					key: props.state.dragDropKey,
				})
			}
			onDragOver={(e) => props.state.dragDrop.onDragOver(e)}
		>
			{/* Group Header */}
			<div
				class={classNames(
					"w-full bg-container-4 cursor-pointer rounded-md border border-border flex justify-between items-center",
					{
						"p-2": props.state.repeaterDepth > 0,
						"p-15": props.state.repeaterDepth === 0,
						"border-b-0 rounded-b-none": getGroupOpen(),
					},
				)}
				onClick={toggleDropdown}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						toggleDropdown();
					}
				}}
			>
				<div class="flex items-center">
					<button
						type="button"
						class="text-icon-base mr-2 hover:text-primary-hover transition-colors duration-200 cursor-pointer"
						onDragStart={(e) =>
							props.state.dragDrop.onDragStart(e, {
								index: groupId(),
								key: props.state.dragDropKey,
							})
						}
						onDragEnd={(e) => props.state.dragDrop.onDragEnd(e)}
						onDragEnter={(e) =>
							props.state.dragDrop.onDragEnter(e, {
								index: groupId(),
								key: props.state.dragDropKey,
							})
						}
						onDragOver={(e) => props.state.dragDrop.onDragOver(e)}
						draggable={true}
						aria-label={T("change_order")}
					>
						<FaSolidGripLines class="w-4" />
					</button>
					<h3 class="text-sm text-body">
						{props.state.fieldConfig.title}-
						{props.state.groupIndex + 1}
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
							"bg-container-3":
								props.state.repeaterDepth % 2 !== 0,
						},
					)}
				>
					<For each={configChildrenFields()}>
						{(config) => (
							<CustomFields.DynamicField
								state={{
									brickIndex: brickIndex(),
									fieldConfig: config,
									fields: groupFields(),
									groupId: groupId(),
									repeaterKey: props.state.repeaterKey,
									repeaterDepth: nextRepeaterDepth(),
								}}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
};
