import T from "@/translations";
import { Component, For, createSignal, createMemo, onMount } from "solid-js";
import classNames from "classnames";
import { FaSolidPlus } from "solid-icons/fa";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
// Stores
import builderStore from "@/store/builderStore";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import BrickPreview from "@/components/Partials/BrickPreview";

interface BuilderProps {
  state: {
    setOpenSelectBrick: (_open: boolean) => void;
  };
  data: {
    brickConfig: BrickConfigT[];
  };
}

export const Builder: Component<BuilderProps> = (props) => {
  // ------------------------------
  // State
  const [getHighlightedBrick, setHighlightedBrick] = createSignal<
    string | undefined
  >(undefined);

  const [getMousePos, setMousePos] = createSignal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // ------------------------------
  // Memos
  const highlightedBrick = createMemo(() => {
    const highlighted = props.data.brickConfig.find(
      (brickConfig) => brickConfig.key === getHighlightedBrick()
    );
    return highlighted;
  });

  const mousePosX = createMemo(() => {
    return getMousePos().x + 20;
  });
  const mousePosY = createMemo(() => {
    return getMousePos().y + 20;
  });

  // ------------------------------
  // Functions
  const updateMousePos = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // ------------------------------
  // Mount
  onMount(() => {
    document.addEventListener("mousemove", updateMousePos, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousemove", updateMousePos);
    };
  });

  // ------------------------------
  // Classes
  const addBrickBtnClasses = classNames(
    "w-8 h-8 bg-container rounded-full hover:bg-backgroundAccent flex items-center justify-center hover:rotate-90 transition-all duration-300"
  );

  // ----------------------------------
  // Render
  return (
    <>
      <div class="m-auto max-w-3xl w-full">
        {/* Fixed Top Zone */}
        <div>fixed top</div>
        {/* Builder Zone */}
        <div class="my-20 flex flex-col items-center">
          <button
            class={addBrickBtnClasses}
            onClick={() => props.state.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-4 h-4 fill-title" />
          </button>
          <ol class="my-5 w-full">
            <For each={builderStore.get.builder_bricks}>
              {(brick, i) => (
                <PageBuilder.BrickRow
                  type="builder"
                  data={{
                    brick: brick,
                    index: i(),
                    brickConfig: props.data.brickConfig,
                  }}
                  callbacks={{
                    setHighlightedBrick,
                  }}
                />
              )}
            </For>
          </ol>
          <button
            class={addBrickBtnClasses}
            onClick={() => props.state.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-4 h-4 fill-title" />
          </button>
        </div>
        {/* Fixed Bottom/Sidebar Zone */}
        <div>fixed bottom</div>
      </div>
      {/* Preview */}
      <div
        class={classNames(
          "fixed top-0 left-0 z-50 bg-container w-52 rounded-md pointer-events-none transition-opacity duration-200",
          {
            "opacity-0": !highlightedBrick(),
            "opacity-100": highlightedBrick(),
          }
        )}
        style={{
          transform: `translate(${mousePosX()}px, ${mousePosY()}px)`,
        }}
      >
        <BrickPreview data={{ brick: highlightedBrick() }} />
        <div class="border-t border-border p-2">
          <p class="text-center text-xs font-bold">{T("update_brick")}</p>
        </div>
      </div>
    </>
  );
};

export default Builder;
