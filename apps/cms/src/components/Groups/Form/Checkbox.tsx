import { Component, Show, createSignal } from "solid-js";
import classnames from "classnames";
import { FaSolidTriangleExclamation, FaSolidCheck } from "solid-icons/fa";
import { Checkbox } from "@kobalte/core";
// Types
import { ErrorResult } from "@/types/api";

interface CheckboxInputProps {
  id?: string;
  value: boolean;
  onChange: (_value: boolean) => void;
  name?: string;
  copy: {
    label?: string;
    describedBy?: string;
  };
  required?: boolean;
  errors?: ErrorResult;
  noMargin?: boolean;
}

export const CheckboxInput: Component<CheckboxInputProps> = (props) => {
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
      <Checkbox.Root
        class="flex items-center"
        required={props.required}
        name={props.name}
        checked={props.value}
        onChange={props.onChange}
        id={props.id}
      >
        <Checkbox.Input
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
        <Checkbox.Control
          onClick={(e) => {
            e.stopPropagation();
          }}
          class={classnames(
            `h-5 w-5 rounded-md border-border border-[2px] cursor-pointer hover:border-secondary bg-container data-[checked]:bg-secondary data-[checked]:border-secondaryH data-[checked]:fill-secondaryText transition-colors duration-200`,
            {
              "border-secondary": inputFocus(),
            }
          )}
        >
          <Checkbox.Indicator class="w-full h-full relative">
            <div class="absolute inset-0 flex justify-center items-center">
              <FaSolidCheck size={10} />
            </div>
          </Checkbox.Indicator>
        </Checkbox.Control>
        {props.copy.label && (
          <Checkbox.Label
            class={classnames(
              "text-sm transition-colors duration-200 ease-in-out ml-2.5",
              {
                "text-secondaryH": inputFocus(),
              }
            )}
          >
            {props.copy.label}
          </Checkbox.Label>
        )}
      </Checkbox.Root>

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
