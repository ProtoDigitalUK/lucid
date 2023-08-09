import { Component, Match, Switch, For } from "solid-js";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Components
import { DropdownMenu } from "@kobalte/core";
import { FaSolidFilter } from "solid-icons/fa";

interface FilterItemProps {
  label: string;
  key: string;
  type: "text" | "select" | "boolean" | "date" | "multi-select";
}

interface FilterProps {
  filters: Array<FilterItemProps>;
  searchParams: ReturnType<typeof useSearchParams>;
}

const FilterItem: Component<FilterItemProps> = (props) => {
  return (
    <li>
      <label class="text-primaryText flex items-center">
        <span>{props.label}</span>
      </label>
      <Switch>
        <Match when={props.type === "text"}>
          <input type="text" />
        </Match>
        <Match when={props.type === "select"}>
          <select>
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
        </Match>
        <Match when={props.type === "boolean"}>
          <select>
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
        </Match>
        <Match when={props.type === "date"}>
          <input type="date" />
        </Match>
        <Match when={props.type === "multi-select"}>
          <select multiple>
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
        </Match>
      </Switch>
    </li>
  );
};

export const Filter: Component<FilterProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="text-title fill-title flex items-center duration-200 transition-colors focus:outline outline-secondary outline-1">
        <DropdownMenu.Icon>
          <FaSolidFilter />
        </DropdownMenu.Icon>
        <span class="ml-2">Filter</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          as={"ul"}
          class="bg-primary rounded-md w-[300px] p-15 shadow-md animate-animate-dropdown focus:outline-none focus:ring-2 ring-secondary"
        >
          <For each={props.filters}>
            {(filter) => <FilterItem {...filter} />}
          </For>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
