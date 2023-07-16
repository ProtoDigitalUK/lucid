import { Component, Accessor, Show, createSignal } from "solid-js";
import classnames from "classnames";
import { FaSolidTriangleExclamation } from "solid-icons/fa";

interface InputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  name: string;
  copy: {
    label: string;
    placeholder?: string;
    describedBy?: string;
  };
  autoFoucs?: boolean;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  errors: Accessor<APIErrorResponse | undefined>;
}

const Input: Component<InputProps> = ({
  id,
  type,
  value,
  onChange,
  name,
  copy: { label, placeholder, describedBy },
  autoFoucs = false,
  autoComplete = "off",
  required = false,
  disabled = false,
  errors,
}) => {
  const [inputFocus, setInputFocus] = createSignal(false);

  // ----------------------------------------
  // Render
  return (
    <div class="mb-5 last:mb-0 w-full">
      <div
        class={classnames(
          "flex flex-col border rounded-md bg-backgroundAccent transition-colors duration-200 ease-in-out",
          {
            "border-secondary bg-backgroundAccentH": inputFocus(),
            "border-error": errors()?.errors?.body[name]?.message !== undefined,
          }
        )}
      >
        <label
          for={id}
          class={classnames(
            "block pt-2 px-2.5 text-sm transition-colors duration-200 ease-in-out",
            {
              "text-secondaryH": inputFocus(),
            }
          )}
        >
          {label}
          <Show when={required}>
            <span class="text-error ml-1 inline">*</span>
          </Show>
        </label>
        <input
          class="bg-transparent focus:outline-none px-2.5 pb-2 pt-1 rounded-b-md text-sm"
          id={id}
          name={name}
          type={type}
          value={value}
          onInput={(e) => onChange(e.currentTarget.value)}
          placeholder={placeholder}
          aria-describedby={describedBy ? `${id}-description` : undefined}
          autocomplete={autoComplete}
          autofocus={autoFoucs}
          required={required}
          disabled={disabled}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </div>

      {/* Described By */}
      <Show when={describedBy !== undefined}>
        <div
          id={`${id}-description`}
          class="text-sm mt-2.5 border-l-4 border-secondary pl-2.5"
        >
          {describedBy}
        </div>
      </Show>

      {/* Errors */}
      <Show when={errors()?.errors?.body[name]?.message !== undefined}>
        <a class="mt-2.5 flex items-center text-sm" href={`#${id}`}>
          <FaSolidTriangleExclamation size={16} class="fill-error mr-2" />
          {errors()?.errors?.body[name]?.message}
        </a>
      </Show>
    </div>
  );
};

export default Input;
