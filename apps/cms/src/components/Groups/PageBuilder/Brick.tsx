import {
  Component,
  Show,
  Switch,
  createMemo,
  createSignal,
  onMount,
  Match,
} from "solid-js";
import classNames from "classnames";
import {
  FaSolidChevronDown,
  FaSolidLock,
  FaSolidTrashCan,
} from "solid-icons/fa";
// Assets
import defaultBrickIconWhite from "@/assets/svgs/default-brick-icon-white.svg";
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
  // State
  const [getAccordionOpen, setAccordionOpen] = createSignal(false);

  // ------------------------------------
  // Refs
  let dropdownContentRef: HTMLDivElement | undefined;

  // ------------------------------------
  // Functions
  const toggleAccordion = () => {
    const state = getAccordionOpen();
    setAccordionOpen(!state);

    if (dropdownContentRef) {
      if (!state) {
        dropdownContentRef.style.maxHeight = `${dropdownContentRef.scrollHeight}px`;
      } else {
        dropdownContentRef.style.maxHeight = "0px";
      }
    }
  };

  // ------------------------------------
  // Mount
  onMount(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log(mutation);
        if (mutation.type === "childList") {
          if (!getAccordionOpen()) return;
          dropdownContentRef!.style.maxHeight = `${
            dropdownContentRef!.scrollHeight
          }px`;
          dropdownContentRef!.style.transition = "";
        }
      });
    });

    observer.observe(dropdownContentRef!, {
      childList: true,
      subtree: true,
    });
  });

  // ------------------------------
  // Memos
  const config = createMemo(() => {
    return props.data.brickConfig.find(
      (brick) => brick.key === props.data.brick.key
    );
  });
  const isFixed = createMemo(() => {
    return props.data.brick.type === "fixed";
  });

  // ----------------------------------
  // Render
  return (
    <Show when={config() !== undefined}>
      <li class="w-full mb-15 last:mb-0 bg-container rounded-md border border-border">
        <div
          class={classNames(
            "border-b p-15 flex w-full items-center justify-between duration-200 transition-all cursor-pointer",
            {
              "border-border": getAccordionOpen(),
              "border-transparent": !getAccordionOpen(),
            }
          )}
          onClick={toggleAccordion}
        >
          <div class="flex items-center">
            <span class="w-7 h-7 rounded-md bg-secondary flex items-center justify-center mr-2.5 fill-white">
              <Switch>
                <Match when={isFixed() === false}>
                  <img src={defaultBrickIconWhite} class="m-auto h-3.5" />
                </Match>
                <Match when={isFixed() === true}>
                  <FaSolidLock size={14} />
                </Match>
              </Switch>
            </span>
            <h3 class="font-semibold text-base">{config()?.title}</h3>
          </div>
          <div class="flex items-center gap-2.5">
            <Show when={isFixed() === false}>
              <button
                type="button"
                class="h-7 w-7 flex items-center justify-center bg-backgroundAccent hover:bg-errorH hover:border-errorH fill-black hover:fill-errorText border border-border rounded-full duration-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FaSolidTrashCan size={14} />
              </button>
            </Show>
            <button
              class={classNames(
                "h-7 w-7 flex items-center justify-center hover:bg-primaryH hover:fill-primaryText hover:border-primaryH rounded-full border transition-all duration-200",
                {
                  "rotate-180 bg-primaryH fill-primaryText border-primaryH":
                    getAccordionOpen(),
                  "bg-backgroundAccent fill-black border-border":
                    !getAccordionOpen(),
                }
              )}
            >
              <FaSolidChevronDown size={14} />
            </button>
          </div>
        </div>
        <div
          ref={dropdownContentRef}
          class={"w-full overflow-hidden transition-all duration-200 max-h-0"}
        >
          <div class="p-15">
            <PageBuilder.BrickBody
              data={{
                brick: props.data.brick,
                config: config() as BrickConfigT,
              }}
            />
          </div>
        </div>
      </li>
    </Show>
  );
};
