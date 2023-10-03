import { Component, For, createMemo } from "solid-js";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
import type { DropZoneCBT } from "@/components/Partials/DragDropZone";
// Stores
import builderStore from "@/store/builderStore";
// Components
import BrickPreview from "@/components/Partials/BrickPreview";
import DragDropZone from "@/components/Partials/DragDropZone";
import classNames from "classnames";

interface PreviewBarProps {
  data: {
    brickConfig: BrickConfigT[];
  };
}

export const PreviewBar: Component<PreviewBarProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <DragDropZone
      zoneId="builder-preview"
      sortOrder={(index, targetIndex) => {
        builderStore.get.sortOrder({
          type: "builder_bricks",
          from: index,
          to: targetIndex,
        });
      }}
    >
      {({ dropZone }) => (
        <ol class="w-full">
          <For each={builderStore.get.builder_bricks}>
            {(brick, i) => (
              <PreviewBarItem
                type="builder"
                data={{
                  key: brick.key,
                  brickConfig: props.data.brickConfig,
                  index: i(),
                }}
                callbacks={{ dropZone }}
              />
            )}
          </For>
        </ol>
      )}
    </DragDropZone>
  );
};

interface PreviewBarItemProps {
  type: "builder" | "fixed";
  data: {
    key: string;
    brickConfig: BrickConfigT[];
    index: number;
  };
  callbacks: {
    dropZone: DropZoneCBT;
  };
}

const PreviewBarItem: Component<PreviewBarItemProps> = (props) => {
  // ------------------------------
  // Memos
  const brickConfig = createMemo(() => {
    return props.data.brickConfig.find((brick) => brick.key === props.data.key);
  });

  // ----------------------------------
  // Render
  return (
    <li
      data-zoneId={props.callbacks.dropZone.zoneId}
      class={classNames("cursor-grab mb-2 last:mb-0", {
        "opacity-60":
          props.callbacks.dropZone.getDraggingIndex() === props.data.index,
      })}
      onDragStart={(e) =>
        props.callbacks.dropZone.onDragStart(e, props.data.index)
      }
      onDragEnd={(e) => props.callbacks.dropZone.onDragEnd(e)}
      onDragEnter={(e) =>
        props.callbacks.dropZone.onDragEnter(e, props.data.index)
      }
      onDragOver={(e) => props.callbacks.dropZone.onDragOver(e)}
      draggable={props.type === "builder"}
    >
      <BrickPreview
        data={{
          brick: brickConfig(),
        }}
      />
    </li>
  );
};
