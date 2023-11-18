import { Component, Show, createMemo } from "solid-js";
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
      <li class="w-full mb-15 last:mb-0">
        <div class="bg-container w-full rounded-md p-15">
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
      </li>
    </Show>
  );
};
