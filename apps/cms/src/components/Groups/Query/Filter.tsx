import {
  Component,
  Match,
  Switch,
  For,
  createSignal,
  createEffect,
} from "solid-js";
import { FaSolidFilter } from "solid-icons/fa";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Components
import { DropdownMenu } from "@kobalte/core";
import DropdownContent from "@/components/Partials/DropdownContent";
import Form from "@/components/Groups/Form";

interface FilterItemProps {
  filter: {
    label: string;
    key: string;
    type: "text" | "select" | "boolean" | "multi-select";
    options?: Array<{
      label: string;
      value: string;
    }>;
  };
  searchParams: ReturnType<typeof useSearchParams>;
}

interface FilterProps {
  filters: Array<FilterItemProps["filter"]>;
  searchParams: ReturnType<typeof useSearchParams>;
}

const FilterItem: Component<FilterItemProps> = (props) => {
  // ----------------------------------
  // State
  const [value, setValue] = createSignal<string>("");
  const [multiValue, setMultiValue] = createSignal<
    {
      value: string | number;
      label: string;
    }[]
  >([]);

  // ----------------------------------
  // Effects
  createEffect(() => {
    // on the filter change from search params, update the value
    const filters = props.searchParams.getFilters();
    const filter = filters.get(props.filter.key);

    if (typeof filter === "string" || typeof filter === "number") {
      setValue(filter.toString());
    } else if (Array.isArray(filter)) {
      setMultiValue(
        filter.map((v) => {
          const label = props.filter.options?.find((o) => o.value === v)?.label;
          return {
            value: v,
            label: label || v.toString(),
          };
        })
      );
    }
  });

  // ----------------------------------
  // Functions
  const setFilterParam = () => {
    if (props.filter.type === "text" || props.filter.type === "select") {
      props.searchParams.setParams({
        filters: {
          [props.filter.key]: value(),
        },
      });
    } else if (props.filter.type === "multi-select") {
      const values = multiValue().map((v) => v.value);
      props.searchParams.setParams({
        filters: {
          [props.filter.key]: values as string[] | number[],
        },
      });
    }
  };

  // ----------------------------------
  // Render
  return (
    <li class="mb-2 last-of-type:mb-0">
      <label
        for={`${props.filter.key}-${props.filter.type}`}
        class="text-primaryText flex items-center text-sm mb-1"
      >
        <span>{props.filter.label}</span>
      </label>
      <Switch>
        <Match when={props.filter.type === "text"}>
          <Form.Input
            id={`${props.filter.key}-${props.filter.type}`}
            value={value()}
            onChange={setValue}
            type="text"
            name={`${props.filter.key}-${props.filter.type}`}
            onBlur={setFilterParam}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setFilterParam();
              }
            }}
            noMargin={true}
          />
        </Match>
        <Match when={props.filter.type === "select"}>
          <select>
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
        </Match>
        <Match when={props.filter.type === "boolean"}>
          <select>
            <option value="1">One</option>
            <option value="2">Two</option>
          </select>
        </Match>
        <Match when={props.filter.type === "multi-select"}>
          <Form.SelectMultiple
            id={`${props.filter.key}-${props.filter.type}`}
            values={multiValue()}
            onChange={(values) => {
              setMultiValue(values);
              setFilterParam();
            }}
            name={`${props.filter.key}-${props.filter.type}`}
            options={props.filter.options || []}
            noMargin={true}
          />
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
        <For each={props.filters}>
          {(filter) => (
            <FilterItem filter={filter} searchParams={props.searchParams} />
          )}
        </For>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};
