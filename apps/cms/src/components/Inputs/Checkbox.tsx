import { Component, Show, createSignal } from "solid-js";
import classnames from "classnames";
import { FaSolidTriangleExclamation, FaSolidCheck } from "solid-icons/fa";
import { Checkbox } from "@kobalte/core";

interface CheckboxInputProps {
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
  name: string;
  copy: {
    label?: string;
    describedBy?: string;
  };
  required?: boolean;
  errors?: ErrorResult;
  noMargin?: boolean;
}

const CheckboxInput: Component<CheckboxInputProps> = (props) => {
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
        class="block items-center"
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
          class={classnames(
            `h-5 w-5 rounded-md border-border border cursor-pointer bg-backgroundAccent data-[checked]:bg-secondary data-[checked]:border-secondaryH data-[checked]:fill-secondaryText`,
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
              "text-sm transition-colors duration-200 ease-in-out",
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

export default CheckboxInput;
