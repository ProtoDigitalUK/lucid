import T from "@/translations";
import { Component, For, Switch, createMemo, Match } from "solid-js";
import { FaSolidSort, FaSolidCaretUp, FaSolidMinus } from "solid-icons/fa";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Components
import { DropdownMenu } from "@kobalte/core";
import DropdownContent from "@/components/Partials/DropdownContent";
import classNames from "classnames";

interface SortItemProps {
  sort: {
    label: string;
    key: string;
  };
  searchParams: ReturnType<typeof useSearchParams>;
}

export interface SortProps {
  sorts: Array<SortItemProps["sort"]>;
  searchParams: ReturnType<typeof useSearchParams>;
}

const SortItem: Component<SortItemProps> = (props) => {
  // ----------------------------------
  // Memos
  const sort = createMemo(() => {
    const sorts = props.searchParams.getSorts();
    const sort = sorts.get(props.sort.key);
    return sort;
  });

  // ----------------------------------
  // Render
  return (
    <li class="mb-2 last-of-type:mb-0">
      <button
        tabIndex={0}
        class="w-full flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-secondary"
        onClick={() => {
          let sortValue: "asc" | "desc" | undefined;
          if (sort() === undefined) {
            sortValue = "asc";
          } else if (sort() === "asc") {
            sortValue = "desc";
          } else if (sort() === "desc") {
            sortValue = undefined;
          }

          props.searchParams.setParams({
            sorts: {
              [props.sort.key]: sortValue,
            },
          });
        }}
      >
        <label
          for={`${props.sort.key}`}
          class="text-primaryText flex items-center justify-between text-sm mr-2"
        >
          <span class="line-clamp-1 text-left">{props.sort.label}</span>
        </label>
        <div
          class={classNames(
            "w-5 h-5 min-w-[20px] rounded-md flex items-center justify-center transition-colors duration-200",
            {
              "bg-secondary group-hover:bg-secondaryH":
                sort() === "desc" || sort() === "asc",
              "bg-container group-hover:bg-backgroundAccent":
                sort() === undefined,
            }
          )}
        >
          <Switch>
            <Match when={sort() === "desc" || sort() === "asc"}>
              <FaSolidCaretUp
                class={classNames("w-3 h-3 fill-primaryText", {
                  "transform rotate-180": sort() === "desc",
                })}
              />
            </Match>
            <Match when={sort() === undefined}>
              <FaSolidMinus class="w-3 h-3 fill-title" />
            </Match>
          </Switch>
        </div>
      </button>
    </li>
  );
};

export const Sort: Component<SortProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="dropdown-trigger text-title fill-title flex items-center text-base font-display">
        <DropdownMenu.Icon>
          <FaSolidSort />
        </DropdownMenu.Icon>
        <span class="ml-2">{T("sort")}</span>
      </DropdownMenu.Trigger>
      <DropdownContent
        options={{
          as: "ul",
          rounded: true,
          class: "w-[180px]",
        }}
      >
        <For each={props.sorts}>
          {(sort) => <SortItem sort={sort} searchParams={props.searchParams} />}
        </For>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};
