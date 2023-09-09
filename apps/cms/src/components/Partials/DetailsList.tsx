import { Component, For, Show } from "solid-js";
// Components
import Pill from "@/components/Partials/Pill";

interface DetailsListProps {
  items: Array<{
    label: string;
    value?: string;
    show?: boolean;
  }>;
}

const DetailsList: Component<DetailsListProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <ul class="w-full">
      <For each={props.items}>
        {(item) => (
          <Show when={item.show !== false}>
            <li class="flex justify-between items-center mb-1 last:mb-0">
              <span class="font-medium text-unfocused">{item.label}</span>
              <Show when={item.value}>
                <Pill theme="primary">{item.value}</Pill>
              </Show>
            </li>
          </Show>
        )}
      </For>
    </ul>
  );
};

export default DetailsList;
