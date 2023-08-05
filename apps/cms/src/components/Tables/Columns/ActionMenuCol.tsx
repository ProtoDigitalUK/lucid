import { Component, For, Switch, Match } from "solid-js";
import { FaSolidEllipsisVertical, FaSolidChevronRight } from "solid-icons/fa";
// Components
import { DropdownMenu } from "@kobalte/core";
import Table from "@/components/Groups/Table";
import { Link } from "@solidjs/router";

export interface ActionMenuColProps {
  actions: Array<{
    label: string;
    type: "button" | "link";
    onClick?: () => void;
    href?: string;
    permission?: boolean;
  }>;
}

const ActionMenuCol: Component<ActionMenuColProps> = (props) => {
  const liItemClasses =
    "flex justify-between my-1 items-center px-2.5 rounded-md hover:bg-primaryH w-full text-sm hover:text-primaryText text-left py-1 text-primaryText fill-primaryText";

  // ----------------------------------------
  // Render
  return (
    <Switch>
      <Match when={props.actions.length > 0}>
        <Table.Td
          classes={"row-actions-td text-right sticky right-0 bg-background"}
          options={{
            noMinWidth: true,
          }}
        >
          <DropdownMenu.Root>
            <DropdownMenu.Trigger class="w-7 h-7 bg-background rounded-md flex justify-center items-center hover:bg-backgroundAccent duration-200 transition-colors focus:outline outline-secondary outline-1">
              <span class="sr-only">Toggle Column Visibility</span>
              <DropdownMenu.Icon>
                <FaSolidEllipsisVertical class="fill-body" />
              </DropdownMenu.Icon>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content class="bg-primary rounded-md w-[200px] px-2 py-1 shadow-md animate-animate-dropdown focus:outline-none focus:ring-2 ring-secondary">
                <ul class="divide-primaryA divide-y">
                  <For each={props.actions}>
                    {(action) => (
                      <li>
                        <Switch>
                          <Match when={action.type === "link"}>
                            <Link
                              href={action.href || "/"}
                              class={liItemClasses}
                            >
                              <span class="line-clamp-1 mr-2.5">
                                {action.label}
                              </span>
                              <FaSolidChevronRight size={14} />
                            </Link>
                          </Match>
                          <Match when={action.type === "button"}>
                            <button
                              onClick={action.onClick}
                              class={liItemClasses}
                            >
                              <span class="line-clamp-1 mr-2.5">
                                {action.label}
                              </span>
                              <FaSolidChevronRight size={14} />
                            </button>
                          </Match>
                        </Switch>
                      </li>
                    )}
                  </For>
                </ul>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </Table.Td>
      </Match>
      <Match when={props.actions.length === 0}>
        <Table.Td
          options={{
            noMinWidth: true,
          }}
        >
          <></>
        </Table.Td>
      </Match>
    </Switch>
  );
};

export default ActionMenuCol;
