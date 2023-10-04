import T from "@/translations";
import {
  Component,
  For,
  createSignal,
  createMemo,
  onMount,
  Switch,
  Match,
} from "solid-js";
import classNames from "classnames";
import { FaSolidPlus } from "solid-icons/fa";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
// Stores
import builderStore from "@/store/builderStore";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import BrickPreview from "@/components/Partials/BrickPreview";
import DragDropZone from "@/components/Partials/DragDropZone";
import Button from "@/components/Partials/Button";

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
  const [getShowBrickPreview, setShowBrickPreview] =
    createSignal<boolean>(false);

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

  const showBrickPreview = createMemo(() => {
    if (!highlightedBrick()) return false;
    return getShowBrickPreview();
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
    "w-6 h-6 bg-container rounded-full hover:bg-backgroundAccent flex items-center justify-center hover:rotate-90 transition-all duration-300"
  );

  // ----------------------------------
  // Render
  return (
    <>
      <div class="m-auto max-w-3xl w-full">
        {/* Fixed Top Zone */}
        <ul>
          <For
            each={builderStore.get.fixedBricks.filter(
              (brick) => brick.position === "top"
            )}
          >
            {(brick, i) => (
              <PageBuilder.BrickRow
                type="fixed"
                data={{
                  brick: brick,
                  index: i(),
                  brickConfig: props.data.brickConfig,
                }}
                callbacks={{
                  setHighlightedBrick,
                  setShowBrickPreview,
                }}
              />
            )}
          </For>
        </ul>
        {/* Builder Zone */}
        <div class="my-20 flex flex-col items-center">
          <button
            class={addBrickBtnClasses}
            onClick={() => props.state.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-3 h-3 fill-title" />
          </button>
          <Switch>
            <Match when={builderStore.get.builderBricks.length === 0}>
              <div class="my-10 w-full flex items-center justify-center">
                <Button
                  type="button"
                  theme="container-outline"
                  size="small"
                  onClick={() => props.state.setOpenSelectBrick(true)}
                >
                  {T("add_brick")}
                </Button>
              </div>
            </Match>
            <Match when={builderStore.get.builderBricks.length > 0}>
              <DragDropZone
                zoneId="builder-main"
                sortOrder={(index, targetIndex) => {
                  builderStore.get.sortOrder({
                    type: "builderBricks",
                    from: index,
                    to: targetIndex,
                  });
                }}
              >
                {({ dropZone }) => (
                  <ol class="my-5 w-full">
                    <For each={builderStore.get.builderBricks}>
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
                            setShowBrickPreview,
                            dropZone,
                          }}
                        />
                      )}
                    </For>
                  </ol>
                )}
              </DragDropZone>
            </Match>
          </Switch>

          <button
            class={addBrickBtnClasses}
            onClick={() => props.state.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-3 h-3 fill-title" />
          </button>
        </div>
        {/* Fixed Bottom/Sidebar Zone */}
        <ul>
          <For
            each={builderStore.get.fixedBricks.filter(
              (brick) => brick.position === "bottom"
            )}
          >
            {(brick, i) => (
              <PageBuilder.BrickRow
                type="fixed"
                data={{
                  brick: brick,
                  index: i(),
                  brickConfig: props.data.brickConfig,
                }}
                callbacks={{
                  setHighlightedBrick,
                  setShowBrickPreview,
                }}
              />
            )}
          </For>
        </ul>
      </div>
      {/* Preview */}
      <div
        class={classNames(
          "fixed top-0 left-0 z-50 bg-container w-52 rounded-md overflow-hidden pointer-events-none transition-opacity duration-200",
          {
            "opacity-0": !showBrickPreview(),
            "opacity-100": showBrickPreview(),
          }
        )}
        style={{
          transform: `translate(${mousePosX()}px, ${mousePosY()}px)`,
        }}
      >
        <BrickPreview data={{ brick: highlightedBrick() }} />
        <div class="border-t border-border p-2">
          <p class="text-center text-xs font-bold">
            {T("update_brick", {
              name: highlightedBrick()?.title || "",
            })}
          </p>
        </div>
      </div>
    </>
  );
};

export default Builder;
