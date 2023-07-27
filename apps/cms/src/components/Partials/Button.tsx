import { Component, Show, JSX } from "solid-js";
import classnames from "classnames";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
  onCLick?: () => void;

  type?: "button" | "submit" | "reset";
  theme?: "primary" | "primary-slim-outline";
  classes?: string;

  loading?: boolean;
  disabled?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
  // ----------------------------------------
  // Classes
  const buttonClasses = classnames(
    "focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative disabled:cursor-not-allowed",
    {
      "primary-btn": props.theme === "primary",
      "primary-slim-outline-btn": props.theme === "primary-slim-outline",
    }
  );

  // ----------------------------------------
  // Render
  return (
    <button
      type={props.type}
      class={classnames(buttonClasses, props.classes)}
      onClick={props.onCLick}
      disabled={props.disabled || props.loading}
      {...props}
    >
      <Show when={props.loading !== undefined && props.loading}>
        <div
          class={classnames(
            "flex items-center justify-center absolute inset-0 z-10 rounded-md",
            {
              "bg-primary bg-opacity-80": props.theme === "primary",
            }
          )}
        >
          <div class="w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
        </div>
      </Show>
      {props.children}
    </button>
  );
};

export default Button;
