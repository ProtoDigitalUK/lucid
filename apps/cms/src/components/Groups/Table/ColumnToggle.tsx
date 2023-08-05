import { Component, For } from "solid-js";
import { FaSolidTable } from "solid-icons/fa";
// Components
import { DropdownMenu } from "@kobalte/core";
import Form from "@/components/Groups/Form";

interface ColumnToggleProps {
  columns: Array<{
    index: number;
    label: string;
    include: boolean;
  }>;
  callbacks: {
    toggle: (index: number) => void;
  };
}

export const ColumnToggle: Component<ColumnToggleProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="w-7 h-7 bg-background rounded-md flex justify-center items-center hover:bg-backgroundAccent duration-200 transition-colors focus:outline outline-secondary outline-1">
        <span class="sr-only">Toggle Column Visibility</span>
        <DropdownMenu.Icon>
          <FaSolidTable class="fill-body" size={14} />
        </DropdownMenu.Icon>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="bg-primary rounded-md w-[160px] p-15 shadow-md animate-animate-dropdown focus:outline-none focus:ring-2 ring-secondary">
          <ul>
            <For each={props.columns}>
              {(column) => (
                <li class="mb-1.5 last:mb-0 text-primaryText">
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
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
