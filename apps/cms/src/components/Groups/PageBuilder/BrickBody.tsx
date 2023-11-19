import {
  Component,
  For,
  createMemo,
  Show,
  createSignal,
  createEffect,
} from "solid-js";
import classNames from "classnames";
// Types
import type { BrickConfigT } from "@lucid/types/src/bricks";
import type { FieldError } from "@/types/api";
// Store
import builderStore, { type BrickDataT } from "@/store/builderStore";
import contentLanguageStore from "@/store/contentLanguageStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";

interface BrickBodyProps {
  state: {
    brick: BrickDataT;
    config: BrickConfigT;
    fieldErrors: FieldError[];
  };
}

export const BrickBody: Component<BrickBodyProps> = (props) => {
  // -------------------------------
  // State
  const [getActiveTab, setActiveTab] = createSignal<string>();

  // -------------------------------
  // Memos
  const allTabs = createMemo(() => {
    return (
      props.state.config.fields?.filter((field) => field.type === "tab") || []
    );
  });
  const brickIndex = createMemo(() => {
    return builderStore.get.bricks.findIndex(
      (brick) => brick.id === props.state.brick.id
    );
  });
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );

  // -------------------------------
  // Effects
  createEffect(() => {
    if (getActiveTab() === undefined) {
      setActiveTab(allTabs()[0]?.key);
    }
  });

  // -------------------------------
  // Render
  return (
    <>
      {/* Tabs */}
      <Show when={allTabs().length > 0}>
        <div class="border-b border-border mb-15 flex flex-wrap">
          <For each={allTabs()}>
            {(tab) => (
              <button
                class={classNames(
                  "border-b border-border -mb-px text-sm font-medium py-1 px-2 first:pl-0",
                  {
                    "border-secondary": getActiveTab() === tab.key,
                  }
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.title}
              </button>
            )}
          </For>
        </div>
      </Show>

      {/* Body */}
      <For each={props.state.config.fields}>
        {(field) => (
          <CustomFields.DynamicField
            state={{
              brickIndex: brickIndex(),
              field: field,
              activeTab: getActiveTab(),
              contentLanguage: contentLanguage(),
              fieldErrors: props.state.fieldErrors,
            }}
          />
        )}
      </For>
    </>
  );
};
