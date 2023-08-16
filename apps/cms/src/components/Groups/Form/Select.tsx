import { Component, createSignal, For } from "solid-js";
import classnames from "classnames";
// Types
import { ErrorResult } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

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
        <Form.Label
          id={props.id}
          label={props.copy?.label}
          focused={inputFocus()}
          required={props.required}
        />
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
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
