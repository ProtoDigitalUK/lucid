import { Component, JSXElement, createSignal, Accessor } from "solid-js";
import classNames from "classnames";

interface DragItemProps {
	index: number | string;
	key: string;
}

export interface DragDropCBT {
	getIsDragging: Accessor<boolean>;
	getDragging: Accessor<DragItemProps | undefined>;
	getDraggingTarget: Accessor<DragItemProps | undefined>;

	onDragStart: (_e: DragEvent, _item: DragItemProps) => void;
	onDragEnd: (_e: DragEvent) => void;
	onDragEnter: (_e: DragEvent, _item: DragItemProps) => void;
	onDragOver: (_e: DragEvent) => void;
}

interface DragDropProps {
	sortOrder: (_index: number | string, _targetIndex: number | string) => void;
	children: (_props: { dragDrop: DragDropCBT }) => JSXElement;
}

const DragDrop: Component<DragDropProps> = (props) => {
	// ------------------------------
	// State
	const [getIsDragging, setIsDragging] = createSignal<boolean>(false);

	// the item being dragged
	const [getDragging, setDragging] = createSignal<DragItemProps | undefined>(
		undefined,
	);

	// the item being dragged over
	const [getDraggingTarget, setDraggingTarget] = createSignal<
		DragItemProps | undefined
	>(undefined);

	// ------------------------------
	// Functions
	const updateSortOrder = (isDragging: boolean, target: HTMLElement) => {
		if (!validDragTarget(target)) return;

		const dragging = getDragging();
		const dragTarget = getDraggingTarget();

		if (dragging === undefined || dragTarget === undefined) return;
		if (dragging.index === dragTarget.index) return;

		props.sortOrder(dragging.index, dragTarget.index);
		if (isDragging) {
			setDragging(dragTarget);
		}
	};

	const validDragTarget = (target: HTMLElement) => {
		let valid = false;

		const dragging = getDragging();
		const dragTarget = getDraggingTarget();
		if (dragging === undefined || dragTarget === undefined) return false;

		// recursively check parent nodes for valid drop target via data-zoneId attribute
		const checkParentNodes = (node: HTMLElement) => {
			if (node.dataset.dragkey === dragTarget?.key) {
				valid = true;
				return;
			}
			if (node.parentNode)
				checkParentNodes(node.parentNode as HTMLElement);
		};
		checkParentNodes(target);

		return valid;
	};

	// ------------------------------
	// Events
	const onDragStart = (e: DragEvent, item: DragItemProps) => {
		e.dataTransfer?.setDragImage(new Image(), 0, 0);
		e.stopPropagation();

		console.log("drag start");

		setDragging(item);
		setDraggingTarget(item);
		setIsDragging(true);
	};

	const onDragEnd = (e: DragEvent) => {
		e.preventDefault();
		const target = e.target as HTMLElement;
		updateSortOrder(false, target);

		setDragging(undefined);
		setDraggingTarget(undefined);
		setIsDragging(false);
	};

	const onDragEnter = (e: DragEvent, item: DragItemProps) => {
		e.preventDefault();
		if (!validDragTarget(e.target as HTMLElement)) return;

		setDraggingTarget(item);
	};

	const onDragOver = (e: DragEvent) => {
		e.preventDefault();

		// const target = e.target as HTMLElement;
		// updateSortOrder(true, target);
	};

	// ----------------------------------
	// Render
	return (
		<div
			class={classNames(
				"scale-100 w-full transition-transform duration-200",
				{
					"scale-x-[101%]": getIsDragging(),
				},
			)}
		>
			{props.children({
				dragDrop: {
					getIsDragging,
					getDragging,
					getDraggingTarget,
					onDragStart,
					onDragEnd,
					onDragEnter,
					onDragOver,
				},
			})}
		</div>
	);
};

export default DragDrop;
