import { Component, createMemo, Setter, Show, Switch, Match } from "solid-js";
import { FaSolidXmark, FaSolidGripLines, FaSolidLock } from "solid-icons/fa";
import classNames from "classnames";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
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
    setDraggingIndex: Setter<number | undefined>;
    setDraggingOverIndex: Setter<number | undefined>;
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
      id={`brick-${props.data.brick.key}-${props.data.index}`}
      class="w-full relative h-10 bg-primaryA2 mb-15 last:mb-0 rounded-md flex items-center cursor-pointer"
      onMouseOver={() => {
        props.callbacks.setHighlightedBrick(props.data.brick.key);
      }}
      onMouseLeave={() => {
        props.callbacks.setHighlightedBrick(undefined);
      }}
      onDragStart={() => {
        props.callbacks.setDraggingIndex(props.data.index);
        props.callbacks.setDraggingOverIndex(props.data.index);
      }}
      onDragEnd={() => {
        props.callbacks.setDraggingIndex(undefined);
        props.callbacks.setDraggingOverIndex(undefined);
      }}
      onDragEnter={() => {
        props.callbacks.setDraggingOverIndex(props.data.index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      draggable={props.type === "builder"}
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
          props.callbacks.setHighlightedBrick(undefined);
        }}
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
            props.callbacks.setHighlightedBrick(undefined);
          }}
          onClick={(e) => {
            e.stopPropagation();
            builderStore.get.removeBrick({
              type: "builder_bricks",
              index: props.data.index,
            });
          }}
        >
          <FaSolidXmark class="duration-200" />
        </button>
      </Show>
    </li>
  );
};
