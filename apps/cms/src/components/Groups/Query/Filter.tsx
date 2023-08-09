import { Component, Match, Switch, For } from "solid-js";
import { FaSolidFilter } from "solid-icons/fa";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Components
import { DropdownMenu } from "@kobalte/core";
import DropdownContent from "@/components/Partials/DropdownContent";

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
      <DropdownMenu.Trigger class="dropdown-trigger text-title fill-title flex items-center">
        <DropdownMenu.Icon>
          <FaSolidFilter />
        </DropdownMenu.Icon>
        <span class="ml-2">Filter</span>
      </DropdownMenu.Trigger>
      <DropdownContent
        options={{
          as: "ul",
          rounded: true,
          class: "w-[300px]",
        }}
      >
        <For each={props.filters}>{(filter) => <FilterItem {...filter} />}</For>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};
