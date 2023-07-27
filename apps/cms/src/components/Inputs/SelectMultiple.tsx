import { Component, Show, createSignal, createMemo, For } from "solid-js";
import classnames from "classnames";
// Components
import {
  FaSolidTriangleExclamation,
  FaSolidCheck,
  FaSolidCross,
  FaSolidSort,
} from "solid-icons/fa";
import { Select, As } from "@kobalte/core";

export type SelectMultipleValueT = {
  value: string | number;
  label: string;
};

interface SelectMultipleProps {
  id: string;
  value: SelectMultipleValueT[];
  onChange: (value: SelectMultipleValueT[]) => void;
  options: SelectMultipleValueT[];
  name: string;
  copy: {
    label: string;
    placeholder?: string;
    describedBy?: string;
  };
  required?: boolean;
  disabled?: boolean;
  errors?: ErrorResult;
}

const SelectMultiple: Component<SelectMultipleProps> = (props) => {
  const [inputFocus, setInputFocus] = createSignal(false);

  // ----------------------------------------
  // Render
  return (
    <div class="mb-5 last:mb-0 w-full">
      <div
        class={classnames(
          "flex flex-col border rounded-md bg-backgroundAccent transition-colors duration-200 ease-in-out relative",
          {
            "border-secondary bg-backgroundAccentH": inputFocus(),
            "border-error": props.errors?.message !== undefined,
          }
        )}
      >
        <label
          for={props.id}
          class={classnames(
            "block pt-2 px-2.5 text-sm transition-colors duration-200 ease-in-out",
            {
              "text-secondaryH": inputFocus(),
            }
          )}
        >
          {props.copy.label}
          <Show when={props.required}>
            <span class="text-error ml-1 inline">*</span>
          </Show>
        </label>

        <Select.Root<SelectMultipleValueT>
          multiple
          id={props.id}
          value={props.value}
          onChange={(value) => {
            console.log(value);
            props.onChange(value);
          }}
          options={props.options}
          name={props.name}
          placeholder={props.copy.placeholder}
          aria-describedby={
            props.copy.describedBy ? `${props.id}-description` : undefined
          }
          required={props.required}
          disabled={props.disabled}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          class={
            "bg-transparent focus:outline-none px-2.5 pb-2 pt-1 rounded-b-md text-sm text-title font-medium"
          }
          itemComponent={(props) => (
            <Select.Item item={props.item}>
              <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
              <Select.ItemIndicator>
                <FaSolidCheck />
              </Select.ItemIndicator>
            </Select.Item>
          )}
        >
          <Select.Trigger asChild>
            <As component="div">
              <Select.Value<string>>
                {(state) => (
                  <>
                    <div>
                      <For each={state.selectedOptions()}>
                        {(option) => (
                          <span onPointerDown={(e) => e.stopPropagation()}>
                            {option}
                            <button onClick={() => state.remove(option)}>
                              <FaSolidCross />
                            </button>
                          </span>
                        )}
                      </For>
                    </div>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={state.clear}
                    >
                      <FaSolidCross />
                    </button>
                  </>
                )}
              </Select.Value>
              <Select.Icon>
                <FaSolidSort />
              </Select.Icon>
            </As>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Listbox />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Described By */}
      <Show when={props.copy.describedBy !== undefined}>
        <div
          id={`${props.id}-description`}
          class="text-sm mt-2.5 border-l-4 border-secondary pl-2.5"
        >
          {props.copy.describedBy}
        </div>
      </Show>

      {/* Errors */}
      <Show when={props.errors?.message !== undefined}>
        <a class="mt-2.5 flex items-center text-sm" href={`#${props.id}`}>
          <FaSolidTriangleExclamation size={16} class="fill-error mr-2" />
          {props.errors?.message}
        </a>
      </Show>
    </div>
  );
};

export default SelectMultiple;
