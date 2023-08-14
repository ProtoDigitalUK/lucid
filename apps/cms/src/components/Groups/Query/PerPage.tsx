import { Component, For, createMemo } from "solid-js";
import { FaSolidSort } from "solid-icons/fa";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Components
import { DropdownMenu } from "@kobalte/core";
import DropdownContent from "@/components/Partials/DropdownContent";
import classNames from "classnames";

export interface PerPageProps {
  options?: Array<number>;
  searchParams: ReturnType<typeof useSearchParams>;
}

export const PerPage: Component<PerPageProps> = (props) => {
  // ----------------------------------
  // Memos
  const options = createMemo(() => {
    return props.options || [10, 25, 50];
  });

  const currentPerPage = createMemo(() => {
    return props.searchParams.getPagination().per_page;
  });

  // ----------------------------------
  // Render
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="dropdown-trigger text-title fill-title flex items-center text-sm font-display">
        <span class="mr-2">
          Per page <b>{currentPerPage()}</b>
        </span>
        <DropdownMenu.Icon>
          <FaSolidSort />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>
      <DropdownContent
        options={{
          as: "ul",
          rounded: true,
          class: "w-[180px]",
        }}
      >
        <For each={options()}>
          {(perpage) => (
            <li class="w-full">
              <button
                tabIndex={0}
                class={classNames(
                  "w-full flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-secondary px-1.5 py-1 rounded-md",
                  {
                    "bg-secondary text-secondaryText":
                      currentPerPage() === perpage,
                  }
                )}
                onClick={() => {
                  props.searchParams.setParams({
                    pagination: {
                      per_page: perpage,
                    },
                  });
                }}
              >
                <label for={`${perpage}`} class="text-primaryText text-sm">
                  <span class="line-clamp-1 text-left">{perpage}</span>
                </label>
              </button>
            </li>
          )}
        </For>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};
