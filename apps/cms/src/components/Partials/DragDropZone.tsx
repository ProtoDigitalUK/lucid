import { Component, JSXElement, createSignal, Setter } from "solid-js";

interface DragDropZoneProps {
  children: (_props: {
    setDraggingIndex: Setter<number | undefined>;
    setDraggingOverIndex: Setter<number | undefined>;
  }) => JSXElement;
}

const DragDropZone: Component<DragDropZoneProps> = (props) => {
  // ------------------------------
  // State
  const [getDraggingIndex, setDraggingIndex] = createSignal<number | undefined>(
    undefined
  );
  const [getDraggingOverIndex, setDraggingOverIndex] = createSignal<
    number | undefined
  >(undefined);

  // ------------------------------
  // Functions

  // ------------------------------
  // Effects

  // ----------------------------------
  // Render
  return (
    <>
      <p class="text-white">
        dragging:
        {getDraggingIndex()}
      </p>
      <p class="text-white">
        dragging over:
        {getDraggingOverIndex()}
      </p>
      {props.children({
        setDraggingIndex,
        setDraggingOverIndex,
      })}
    </>
  );
};

export default DragDropZone;
