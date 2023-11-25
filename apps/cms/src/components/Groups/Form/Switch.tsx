import T from "@/translations";
import { Component, createSignal } from "solid-js";
import classnames from "classnames";
// Types
import type { ErrorResult, FieldError } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface SwitchProps {
  id: string;
  value: boolean;
  onChange: (_value: boolean) => void;
  name?: string;
  copy: {
    label?: string;
    describedBy?: string;
    true?: string;
    false?: string;
    tooltip?: string;
  };
  required?: boolean;
  errors?: ErrorResult | FieldError;
  noMargin?: boolean;
  theme?: "basic";
}

export const Switch: Component<SwitchProps> = (props) => {
  let checkboxRef: HTMLInputElement | undefined;
  const [inputFocus, setInputFocus] = createSignal(false);

  // ----------------------------------------
  // Render
  return (
    <div
      class={classnames("w-full relative", {
        "mb-0": props.noMargin,
        "mb-15 last:mb-0": !props.noMargin,
      })}
    >
      <Form.Label
        id={props.id}
        label={props.copy?.label}
        focused={inputFocus()}
        required={props.required}
        theme={props.theme}
      />
      <input
        ref={checkboxRef}
        type="checkbox"
        id={props.id}
        name={props.name}
        checked={props.value}
        onChange={(e) => {
          props.onChange(e.currentTarget.checked);
        }}
        class="hidden"
      />
      <button
        type="button"
        class="bg-backgroundAccent rounded-md flex border border-border mt-1 relative h-10 focus:border-secondary"
        onClick={() => {
          checkboxRef?.click();
        }}
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
      >
        <span
          class={classnames(
            "w-1/2 px-15 py-1 flex items-center text-center z-10 relative duration-200 transition-colors text-sm h-full",
            {
              "text-secondaryText": !props.value,
              "text-title": props.value,
            }
          )}
        >
          {props.copy?.false || T("false")}
        </span>
        <span
          class={classnames(
            "w-1/2 px-15 py-1 flex items-center text-center z-10 relative duration-200 transition-colors text-sm h-full",
            {
              "text-secondaryText": props.value,
              "text-title": !props.value,
            }
          )}
        >
          {props.copy?.true || T("true")}
        </span>
        <span
          class={classnames(
            "w-1/2 bg-secondary absolute top-0 bottom-0 transition-all duration-200 rounded-md z-0",
            {
              "left-1/2": props.value,
              "left-0": !props.value,
            }
          )}
        ></span>
      </button>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.Tooltip copy={props.copy?.tooltip} theme={undefined} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
