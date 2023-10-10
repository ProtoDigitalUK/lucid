import classNames from "classnames";
import { Component, JSXElement, createSignal, Accessor } from "solid-js";

export interface DropZoneCBT {
  zoneId: string;
  getDraggingIndex: Accessor<number | string | undefined>;
  getDraggingOverIndex: Accessor<number | string | undefined>;
  onDragStart: (_e: DragEvent, _index: number | string) => void;
  onDragEnd: (_e: DragEvent) => void;
  onDragEnter: (_e: DragEvent, _index: number | string) => void;
  onDragOver: (_e: DragEvent) => void;
}

interface DragDropZoneProps {
  zoneId: string;
  sortOrder: (_index: number | string, _targetIndex: number | string) => void;
  options?: {
    scale?: "in" | "out";
  };
  children: (_props: { dropZone: DropZoneCBT }) => JSXElement;
}

const DragDropZone: Component<DragDropZoneProps> = (props) => {
  // ------------------------------
  // State
  const [getDraggingIndex, setDraggingIndex] = createSignal<
    number | string | undefined
  >(undefined);
  const [getDraggingOverIndex, setDraggingOverIndex] = createSignal<
    number | string | undefined
  >(undefined);
  const [getIsDragging, setIsDragging] = createSignal<boolean>(false);

  // ------------------------------
  // Functions
  const updateSortOrder = (isDragging: boolean, target: HTMLElement) => {
    if (!validDragTarget(target)) return;

    const index = getDraggingIndex();
    const targetIndex = getDraggingOverIndex();
    if (index === undefined || targetIndex === undefined) return;

    props.sortOrder(index, targetIndex);
    if (isDragging) setDraggingIndex(targetIndex);
  };

  const validDragTarget = (target: HTMLElement) => {
    let valid = false;

    // recursively check parent nodes for valid drop target via data-zoneId attribute
    const checkParentNodes = (node: HTMLElement) => {
      if (node.dataset.zoneid === props.zoneId) {
        valid = true;
        return;
      }
      if (node.parentNode) checkParentNodes(node.parentNode as HTMLElement);
    };
    checkParentNodes(target);

    return valid;
  };

  // ------------------------------
  // Events
  const onDragStart = (e: DragEvent, index: number | string) => {
    e.dataTransfer?.setDragImage(new Image(), 0, 0);
    e.stopPropagation();
    setDraggingIndex(index);
    setDraggingOverIndex(index);
    setIsDragging(true);
  };

  const onDragEnd = (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;

    setDraggingIndex(undefined);
    setDraggingOverIndex(undefined);
    setIsDragging(false);
    updateSortOrder(false, target);
  };

  const onDragEnter = (e: DragEvent, index: number | string) => {
    e.preventDefault();
    setDraggingOverIndex(index);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    updateSortOrder(true, target);
  };

  // ------------------------------
  // Effects

  // ----------------------------------
  // Render
  return (
    <div
      class={classNames("scale-100 w-full transition-transform duration-200", {
        "scale-[105%]": getIsDragging() && props.options?.scale === "in",
        "scale-[99%]": getIsDragging() && props.options?.scale === "out",
      })}
    >
      {props.children({
        dropZone: {
          zoneId: props.zoneId,
          getDraggingOverIndex,
          getDraggingIndex,
          onDragStart,
          onDragEnd,
          onDragEnter,
          onDragOver,
        },
      })}
    </div>
  );
};

export default DragDropZone;
