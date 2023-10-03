import { Component, createMemo, Setter, Show, Switch, Match } from "solid-js";
import { FaSolidXmark, FaSolidGripLines, FaSolidLock } from "solid-icons/fa";
import classNames from "classnames";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
import type { DropZoneCBT } from "@/components/Partials/DragDropZone";
// Assets
import brickIconWhite from "@/assets/svgs/default-brick-icon-white.svg";
// Store
import builderStore, { type BrickDataT } from "@/store/builderStore";

interface BrickRowProps {
  type: "builder" | "fixed";
  data: {
    brick: BrickDataT;
    index: number;
    brickConfig: BrickConfigT[];
  };
  callbacks: {
    setHighlightedBrick: Setter<string | undefined>;
    setShowBrickPreview: Setter<boolean>;
    dropZone?: DropZoneCBT;
  };
}

export const BrickRow: Component<BrickRowProps> = (props) => {
  // ------------------------------
  // Memos
  const config = createMemo(() => {
    return props.data.brickConfig.find(
      (brick) => brick.key === props.data.brick.key
    );
  });

  // ----------------------------------
  // Render
  return (
    <li
      data-zoneId={props.callbacks.dropZone?.zoneId}
      class={classNames(
        "w-full relative h-10 bg-primaryA2 mb-15 last:mb-0 rounded-md flex items-center cursor-pointer transition-opacity duration-200",
        {
          "opacity-60":
            props.callbacks.dropZone?.getDraggingIndex() === props.data.index,
        }
      )}
      onMouseOver={() => {
        props.callbacks.setHighlightedBrick(props.data.brick.key);
        props.callbacks.setShowBrickPreview(true);
      }}
      onMouseLeave={() => {
        props.callbacks.setShowBrickPreview(false);
      }}
      onDragStart={(e) =>
        props.callbacks.dropZone?.onDragStart(e, props.data.index)
      }
      onDragEnd={(e) => props.callbacks.dropZone?.onDragEnd(e)}
      onDragEnter={(e) =>
        props.callbacks.dropZone?.onDragEnter(e, props.data.index)
      }
      onDragOver={(e) => props.callbacks.dropZone?.onDragOver(e)}
    >
      {/* Grab/Locked */}
      <div
        class={classNames(
          "w-6 h-full bg-white bg-opacity-20 rounded-md flex items-center justify-center",
          {
            "cursor-grab": props.type === "builder",
          }
        )}
        onMouseOver={(e) => {
          e.stopPropagation();
          props.callbacks.setShowBrickPreview(false);
        }}
        onDragStart={(e) =>
          props.callbacks.dropZone?.onDragStart(e, props.data.index)
        }
        onDragEnd={(e) => props.callbacks.dropZone?.onDragEnd(e)}
        onDragEnter={(e) =>
          props.callbacks.dropZone?.onDragEnter(e, props.data.index)
        }
        onDragOver={(e) => props.callbacks.dropZone?.onDragOver(e)}
        draggable={props.type === "builder"}
      >
        <Switch>
          <Match when={props.type === "builder"}>
            <FaSolidGripLines class="fill-white w-3" />
          </Match>
          <Match when={props.type === "fixed"}>
            <FaSolidLock class="fill-white w-3" />
          </Match>
        </Switch>
      </div>
      {/* Info Row */}
      <div class="px-15 flex items-center">
        <img src={brickIconWhite} class="w-6 object-contain mr-2.5" />
        <h3 class="text-base text-primaryText">{config()?.title}</h3>
      </div>
      {/* Remove */}
      <Show when={props.type === "builder"}>
        <button
          class="absolute right-15 top-1/2 -translate-y-1/2 fill-white bg-white bg-opacity-20 hover:bg-opacity-30 duration-200 transition-all hover:fill-error rounded-full h-6 w-6 flex items-center justify-center"
          onMouseOver={(e) => {
            e.stopPropagation();
            props.callbacks.setShowBrickPreview(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            builderStore.get.removeBrick({
              type: "builderBricks",
              index: props.data.index,
            });
            props.callbacks.setHighlightedBrick(undefined);
            props.callbacks.setShowBrickPreview(false);
          }}
        >
          <FaSolidXmark class="duration-200" />
        </button>
      </Show>
    </li>
  );
};
