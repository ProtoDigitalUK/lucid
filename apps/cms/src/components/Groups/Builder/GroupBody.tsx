import T from "@/translations/index";
import classNames from "classnames";
import { type Component, For, createMemo, createSignal, Show } from "solid-js";
import type { DragDropCBT } from "@/components/Partials/DragDrop";
import type { CustomField, FieldResponse } from "@lucidcms/core/types";
import { debounce } from "@solid-primitives/scheduled";
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
	const [getConfirmRemove, setConfirmRemove] = createSignal<0 | 1>(0);

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
		brickStore.get.toggleGroupOpen(
			props.state.brickIndex,
			props.state.repeaterKey,
			groupId(),
		);
	};
	const removeGroup = (groupId: number | string) => {
		brickStore.get.removeRepeaterGroup({
			brickIndex: brickIndex(),
			repeaterKey: props.state.repeaterKey,
			groupId: groupId,
		});
	};
	const revertConfigDelete = debounce(() => {
		setConfirmRemove(0);
	}, 4000);

	// -------------------------------
	// Render
	return (
		<div
			data-dragkey={props.state.dragDropKey}
			class={classNames("w-full mb-2.5", {
				"opacity-60":
					props.state.dragDrop.getDragging()?.index === groupId(),
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
					"w-full bg-container-4 cursor-pointer p-2.5 rounded-md border border-border flex justify-between items-center",
					{
						"border-b-0 rounded-b-none": getGroupOpen(),
					},
				)}
				onClick={toggleDropdown}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						toggleDropdown();
					}
				}}
				id={`accordion-header-${groupId()}`}
				aria-expanded={getGroupOpen()}
				aria-controls={`accordion-content-${groupId()}`}
				role="button"
				tabIndex="0"
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
					class={classNames(
						"opacity-60 hover:opacity-100 transition-all duration-200 cursor-pointer",
						{
							"text-icon-base": getConfirmRemove() === 0,
							"text-error-hover animate-pulse opacity-100":
								getConfirmRemove() === 1,
						},
					)}
					onClick={(e) => {
						e.stopPropagation();
						if (getConfirmRemove() === 1) {
							removeGroup(groupId());
						}
						setConfirmRemove(1);
						revertConfigDelete();
					}}
					aria-label={
						getConfirmRemove() === 1
							? T("confirm_delete")
							: T("delete")
					}
				>
					<FaSolidTrashCan class="w-4" />
				</button>
			</div>
			{/* Group Body */}
			<div
				class={classNames(
					"border-border transform-gpu origin-top border-x border-b mb-2.5 last:mb-0 rounded-b-md overflow-hidden w-full duration-200 transition-transform",
					{
						"bg-container-3": props.state.repeaterDepth % 2 !== 0,
						"scale-y-100 h-auto p-15": getGroupOpen(),
						"scale-y-0 h-0 p-0": !getGroupOpen(),
					},
				)}
				role="region"
				aria-labelledby={`accordion-header-${groupId()}`}
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
		</div>
	);
};
