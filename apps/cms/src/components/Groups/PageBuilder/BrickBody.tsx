import { Component, For, createMemo, Show, createSignal } from "solid-js";
import classNames from "classnames";
// Types
import { BrickConfigT } from "@lucid/types/src/bricks";
// Store
import { type BrickDataT } from "@/store/builderStore";
// Components
import CustomFields from "@/components/Groups/CustomFields";

interface BrickBodyProps {
  data: {
    index: number;
    brick: BrickDataT;
    config: BrickConfigT;
  };
}

export const BrickBody: Component<BrickBodyProps> = (props) => {
  // -------------------------------
  // Memos
  const allTabs = createMemo(() => {
    return (
      props.data.config.fields?.filter((field) => field.type === "tab") || []
    );
  });

  // -------------------------------
  // State
  const [getActiveTab, setActiveTab] = createSignal<string>(allTabs()[0]?.key);

  // -------------------------------
  // Render
  return (
    <>
      {/* Tabs */}
      <Show when={allTabs().length > 0}>
        <For each={allTabs()}>
          {(tab) => (
            <button
              class={classNames({
                "bg-primary": getActiveTab() === tab.key,
              })}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.title}
            </button>
          )}
        </For>
      </Show>
      {/* Body */}
      <For each={props.data.config.fields}>
        {(field) => (
          <CustomFields.DynamicField
            data={{
              type: "builderBricks",
              brickIndex: props.data.index,
              field: field,
              activeTab: getActiveTab(),
            }}
          />
        )}
      </For>
    </>
  );
};
