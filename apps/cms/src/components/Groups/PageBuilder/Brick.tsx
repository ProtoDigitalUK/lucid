import { Component, Show, createMemo } from "solid-js";
import { FaSolidPlus } from "solid-icons/fa";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
// Store
import { type BrickDataT } from "@/store/builderStore";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";

interface BrickProps {
  data: {
    brick: BrickDataT;
    brickConfig: BrickConfigT[];
  };
  callbacks: {
    setOpenSelectBrick: (_open: boolean) => void;
  };
}

export const Brick: Component<BrickProps> = (props) => {
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
    <Show when={config() !== undefined}>
      <li class="w-full mb-15">
        <div class="bg-container w-full rounded-md mb-15 p-15">
          <div class="border-b border-border mb-15 pb-15">
            <h3>{config()?.title}</h3>
          </div>
          <PageBuilder.BrickBody
            data={{
              brick: props.data.brick,
              config: config() as BrickConfigT,
            }}
          />
        </div>
        <Show when={props.data.brick.type === "builder"}>
          <button
            class={
              "w-6 h-6 mx-auto bg-container rounded-full hover:bg-backgroundAccent flex items-center justify-center hover:rotate-90 transition-all duration-300"
            }
            onClick={() => props.callbacks.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-3 h-3 fill-title" />
          </button>
        </Show>
      </li>
    </Show>
  );
};
