import { Component, createSignal } from "solid-js";
import classnames from "classnames";
// Types
import { ErrorResult } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface TextareaProps {
  id: string;
  value: string;
  onChange: (_value: string) => void;
  name: string;
  copy?: {
    label?: string;
    placeholder?: string;
    describedBy?: string;
  };
  onBlur?: () => void;
  autoFoucs?: boolean;
  onKeyUp?: (_e: KeyboardEvent) => void;
  required?: boolean;
  disabled?: boolean;
  errors?: ErrorResult;
  noMargin?: boolean;
}

export const Textarea: Component<TextareaProps> = (props) => {
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
        <textarea
          class={classnames(
            "bg-transparent focus:outline-none px-2.5 pb-2 pt-1 rounded-b-md text-sm text-title font-medium resize-none w-full h-40",
            {
              "pt-2": props.copy?.label === undefined,
            }
          )}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          id={props.id}
          name={props.name}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          placeholder={props.copy?.placeholder}
          aria-describedby={
            props.copy?.describedBy ? `${props.id}-description` : undefined
          }
          autofocus={props.autoFoucs}
          required={props.required}
          disabled={props.disabled}
          onFocus={() => setInputFocus(true)}
          onKeyUp={(e) => props.onKeyUp?.(e)}
          onBlur={() => {
            setInputFocus(false);
            props.onBlur?.();
          }}
        />
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
