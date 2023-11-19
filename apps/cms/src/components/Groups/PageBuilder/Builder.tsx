import T from "@/translations/index";
import {
  Component,
  For,
  Switch,
  Match,
  createMemo,
  Show,
  Accessor,
} from "solid-js";
// Assets
import missingContent from "@/assets/illustrations/missing-content.svg";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
import type { APIErrorResponse } from "@/types/api";
// Stores
import builderStore from "@/store/builderStore";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";

interface BuilderProps {
  state: {
    brickConfig: BrickConfigT[];
    mutateErrors: Accessor<APIErrorResponse | undefined>;
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
      <div class="w-full min-h-full flex flex-col">
        {/* Fixed Top Zone */}
        <Show when={topFixedBricks().length > 0}>
          <ul class="mb-15">
            <For each={topFixedBricks()}>
              {(brick) => (
                <PageBuilder.Brick
                  state={{
                    brick,
                    brickConfig: props.state.brickConfig,
                    mutateErrors: props.state.mutateErrors,
                  }}
                />
              )}
            </For>
          </ul>
        </Show>
        {/* Builder Zone */}
        <div class="flex flex-col items-center flex-grow">
          <Switch>
            <Match when={builderBricks().length === 0}>
              <div class="w-full flex items-center justify-center h-full border border-primaryA rounded-md flex-grow p-10">
                <div class="max-w-lg mx-auto w-full text-center">
                  <img
                    src={missingContent}
                    class="w-full max-w-[240px] mx-auto mb-10"
                  />
                  <h3 class="text-white mb-15">
                    {T("constructing_your_page")}
                  </h3>
                  <p class="text-white text-sm">
                    {T("get_started_by_adding_bricks")}
                  </p>
                </div>
              </div>
            </Match>
            <Match when={builderBricks().length > 0}>
              <ol class="w-full">
                <For each={builderBricks()}>
                  {(brick) => (
                    <PageBuilder.Brick
                      state={{
                        brick,
                        brickConfig: props.state.brickConfig,
                        mutateErrors: props.state.mutateErrors,
                      }}
                    />
                  )}
                </For>
              </ol>
            </Match>
          </Switch>
        </div>
        {/* Fixed Bottom/Sidebar Zone */}
        <Show when={bottomFixedBricks().length > 0}>
          <ul class="flex justify-end mt-15">
            <For each={bottomFixedBricks()}>
              {(brick) => (
                <PageBuilder.Brick
                  state={{
                    brick,
                    brickConfig: props.state.brickConfig,
                    mutateErrors: props.state.mutateErrors,
                  }}
                />
              )}
            </For>
          </ul>
        </Show>
      </div>
    </>
  );
};

export default Builder;
