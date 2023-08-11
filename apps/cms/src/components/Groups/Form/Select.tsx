import { Component, Show, createSignal, For } from "solid-js";
import classnames from "classnames";
import { FaSolidTriangleExclamation } from "solid-icons/fa";
// Types
import { ErrorResult } from "@/types/api";

interface SelectProps {
  id: string;
  value: string;
  onChange: (_value: string) => void;
  options: { value: string; label: string }[];
  name: string;
  copy?: {
    label?: string;
    describedBy?: string;
  };
  onBlur?: () => void;
  autoFoucs?: boolean;
  required?: boolean;
  disabled?: boolean;
  errors?: ErrorResult;
  noMargin?: boolean;
}

export const Select: Component<SelectProps> = (props) => {
  const [inputFocus, setInputFocus] = createSignal(false);

  // ----------------------------------------
  // Render
  return (
    <div
      class={classnames("w-full", {
        "mb-0": props.noMargin,
        "mb-5": !props.noMargin,
      })}
    >
      <div
        class={classnames(
          "flex flex-col border rounded-md bg-backgroundAccent transition-colors duration-200 ease-in-out relative",
          {
            "border-secondary bg-backgroundAccentH": inputFocus(),
            "border-error": props.errors?.message !== undefined,
          }
        )}
      >
        <Show when={props.copy?.label !== undefined}>
          <label
            for={props.id}
            class={classnames(
              "block pt-2 px-2.5 text-sm transition-colors duration-200 ease-in-out",
              {
                "text-secondaryH": inputFocus(),
              }
            )}
          >
            {props.copy?.label}
            <Show when={props.required}>
              <span class="text-error ml-1 inline">*</span>
            </Show>
          </label>
        </Show>
        <select
          class={classnames(
            "bg-transparent focus:outline-none px-2.5 pb-2 pt-1 rounded-b-md text-sm text-title font-medium",
            {
              "pt-2": props.copy?.label === undefined,
            }
          )}
          id={props.id}
          name={props.name}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          aria-describedby={
            props.copy?.describedBy ? `${props.id}-description` : undefined
          }
          autofocus={props.autoFoucs}
          required={props.required}
          disabled={props.disabled}
          onFocus={() => setInputFocus(true)}
          onBlur={() => {
            setInputFocus(false);
            props.onBlur?.();
          }}
        >
          <For each={props.options}>
            {({ value, label }) => <option value={value}>{label}</option>}
          </For>
        </select>
      </div>

      {/* Described By */}
      <Show when={props.copy?.describedBy !== undefined}>
        <div
          id={`${props.id}-description`}
          class="text-sm mt-2.5 border-l-4 border-secondary pl-2.5"
        >
          {props.copy?.describedBy}
        </div>
      </Show>

      {/* Errors */}
      <Show when={props.errors?.message !== undefined}>
        <a class="mt-2.5 flex items-start text-sm" href={`#${props.id}`}>
          <FaSolidTriangleExclamation
            size={16}
            class="fill-error mt-[3px] mr-2"
          />
          {props.errors?.message}
        </a>
      </Show>
    </div>
  );
};
