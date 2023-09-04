import T from "@/translations";
import { Component, For } from "solid-js";
import { FaSolidTable } from "solid-icons/fa";
// Components
import { DropdownMenu } from "@kobalte/core";
import Form from "@/components/Groups/Form";
import DropdownContent from "@/components/Partials/DropdownContent";

interface ColumnToggleProps {
  columns: Array<{
    index: number;
    label: string;
    include: boolean;
  }>;
  callbacks: {
    toggle: (_index: number) => void;
  };
}

export const ColumnToggle: Component<ColumnToggleProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="dropdown-trigger w-7 h-7 bg-background rounded-md flex justify-center items-center hover:bg-backgroundAccent">
        <span class="sr-only">{T("toggle_col_visibility")}</span>
        <DropdownMenu.Icon>
          <FaSolidTable class="fill-body" size={14} />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>

      <DropdownContent
        options={{
          as: "ul",
          rounded: true,
          class: "w-[160px]",
        }}
      >
        <For each={props.columns}>
          {(column) => (
            <li class="mb-1.5 last-of-type:mb-0 text-primaryText">
              <Form.Checkbox
                value={column.include}
                onChange={() => props.callbacks.toggle(column.index)}
                copy={{
                  label: column.label,
                }}
                noMargin={true}
              />
            </li>
          )}
        </For>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};