import { Component, Show, createSignal, createMemo } from "solid-js";
import classnames from "classnames";
import { FaSolidEye, FaSolidEyeSlash } from "solid-icons/fa";
// Types
import { ErrorResult } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface InputProps {
  id: string;
  value: string;
  onChange: (_value: string) => void;
  type: string;
  name: string;
  copy?: {
    label?: string;
    placeholder?: string;
    describedBy?: string;
  };
  onBlur?: () => void;
  autoFoucs?: boolean;
  onKeyUp?: (_e: KeyboardEvent) => void;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: ErrorResult;
  noMargin?: boolean;
}

export const Input: Component<InputProps> = (props) => {
  const [inputFocus, setInputFocus] = createSignal(false);
  const [passwordVisible, setPasswordVisible] = createSignal(false);

  // ----------------------------------------
  // Memos
  const inputType = createMemo(() => {
    if (props.type === "password" && passwordVisible()) return "text";
    return props.type;
  });

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
        <input
          class={classnames(
            "bg-transparent focus:outline-none px-2.5 pb-2 pt-1 rounded-b-md text-sm text-title font-medium",
            {
              "pr-[38px]": props.type === "password",
              "pt-2": props.copy?.label === undefined,
            }
          )}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          id={props.id}
          name={props.name}
          type={inputType()}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          placeholder={props.copy?.placeholder}
          aria-describedby={
            props.copy?.describedBy ? `${props.id}-description` : undefined
          }
          autocomplete={props.autoComplete}
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
        {/* Show Password */}
        <Show when={props.type === "password"}>
          <button
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondaryH hover:text-secondary duration-200 transition-colors"
            onClick={() => {
              setPasswordVisible(!passwordVisible());
            }}
          >
            <Show when={passwordVisible()}>
              <FaSolidEyeSlash size={18} class="fill-unfocused" />
            </Show>
            <Show when={!passwordVisible()}>
              <FaSolidEye size={18} class="fill-unfocused" />
            </Show>
          </button>
        </Show>
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
