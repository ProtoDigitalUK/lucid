import T from "@/translations";
import { Component, For, Switch, Match, createMemo } from "solid-js";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
// Stores
import builderStore from "@/store/builderStore";
// Components
import Button from "@/components/Partials/Button";
import PageBuilder from "@/components/Groups/PageBuilder";

interface BuilderProps {
  state: {
    setOpenSelectBrick: (_order?: number) => void;
  };
  data: {
    brickConfig: BrickConfigT[];
  };
}

export const Builder: Component<BuilderProps> = (props) => {
  // ------------------------------
  // State

  // ------------------------------
  // Memos
  const builderBricks = createMemo(() =>
    builderStore.get.bricks
      .filter((brick) => brick.type === "builder")
      .sort((a, b) => a.order - b.order)
  );
  const fixedBricks = createMemo(() =>
    builderStore.get.bricks
      .filter((brick) => brick.type === "fixed")
      .sort((a, b) => a.order - b.order)
  );

  const topFixedBricks = createMemo(() =>
    fixedBricks().filter((brick) => brick.position === "top")
  );
  const bottomFixedBricks = createMemo(() =>
    fixedBricks().filter((brick) => brick.position === "bottom")
  );

  // ------------------------------
  // Functions

  // ------------------------------
  // Mount

  // ------------------------------
  // Classes

  // ----------------------------------
  // Render
  return (
    <>
      <div class="w-full">
        {/* Fixed Top Zone */}
        <ul>
          <For each={topFixedBricks()}>
            {(brick) => (
              <PageBuilder.Brick
                data={{
                  brick,
                  brickConfig: props.data.brickConfig,
                }}
                callbacks={{
                  setOpenSelectBrick: props.state.setOpenSelectBrick,
                }}
              />
            )}
          </For>
        </ul>
        {/* Builder Zone */}
        <div class="flex flex-col items-center">
          <Switch>
            <Match when={builderBricks().length === 0}>
              <div class="my-10 w-full flex items-center justify-center">
                <Button
                  type="button"
                  theme="container-outline"
                  size="small"
                  onClick={() => props.state.setOpenSelectBrick()}
                >
                  {T("add_brick")}
                </Button>
              </div>
            </Match>
            <Match when={builderBricks().length > 0}>
              <ol class="w-full">
                <For each={builderBricks()}>
                  {(brick) => (
                    <PageBuilder.Brick
                      data={{
                        brick,
                        brickConfig: props.data.brickConfig,
                      }}
                      callbacks={{
                        setOpenSelectBrick: props.state.setOpenSelectBrick,
                      }}
                    />
                  )}
                </For>
              </ol>
            </Match>
          </Switch>
        </div>
        {/* Fixed Bottom/Sidebar Zone */}
        <ul>
          <For each={bottomFixedBricks()}>
            {(brick) => (
              <PageBuilder.Brick
                data={{
                  brick,
                  brickConfig: props.data.brickConfig,
                }}
                callbacks={{
                  setOpenSelectBrick: props.state.setOpenSelectBrick,
                }}
              />
            )}
          </For>
        </ul>
      </div>
    </>
  );
};

export default Builder;
