import { Component, Show, createSignal, createMemo } from "solid-js";
import classnames from "classnames";
import {
  FaSolidTriangleExclamation,
  FaSolidEye,
  FaSolidEyeSlash,
} from "solid-icons/fa";
// Types
import { ErrorResult } from "@/types/api";

interface InputProps {
  id: string;
  value: string;
  onChange: (_value: string) => void;
  type: string;
  name: string;
  copy: {
    label: string;
    placeholder?: string;
    describedBy?: string;
  };
  onBlur?: () => void;
  autoFoucs?: boolean;
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
        <input
          class={classnames(
            "bg-transparent focus:outline-none px-2.5 pb-2 pt-1 rounded-b-md text-sm text-title font-medium",
            {
              "pr-[38px]": props.type === "password",
            }
          )}
          id={props.id}
          name={props.name}
          type={inputType()}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
          placeholder={props.copy.placeholder}
          aria-describedby={
            props.copy.describedBy ? `${props.id}-description` : undefined
          }
          autocomplete={props.autoComplete}
          autofocus={props.autoFoucs}
          required={props.required}
          disabled={props.disabled}
          onFocus={() => setInputFocus(true)}
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
