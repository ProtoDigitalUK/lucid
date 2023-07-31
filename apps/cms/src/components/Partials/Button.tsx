import { Component, Show, JSX } from "solid-js";
import classnames from "classnames";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  theme:
    | "primary"
    | "primary-outline"
    | "container-outline"
    | "danger"
    | "basic";
  size: "x-small" | "small" | "medium" | "large" | "icon";
  children: JSX.Element;

  onCLick?: () => void;
  type?: "button" | "submit" | "reset";
  classes?: string;
  loading?: boolean;
  disabled?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
  // ----------------------------------------
  // Classes
  const buttonClasses = classnames(
    "flex items-center justify-center text-center focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative disabled:cursor-not-allowed disabled:opacity-80",
    {
      "bg-primary hover:bg-primaryH text-primaryText hover:text-white fill-primaryText hover:fill-white ring-secondary":
        props.theme === "primary",
      "bg-transparent border border-primaryA hover:bg-primaryH fill-primaryText text-primaryText hover:text-primaryText":
        props.theme === "primary-outline",
      "bg-container border border-primary hover:bg-primaryH fill-primaryText text-title hover:text-primaryText":
        props.theme === "container-outline",
      "bg-error hover:bg-errorH text-errorText ring-secondary fill-errorText":
        props.theme === "danger",
      // Sizes
      "px-2.5 py-2 text-sm": props.size === "x-small",
      "px-5 py-2.5 text-base": props.size === "small",
      "px-5 py-3.5 text-base": props.size === "medium",
      "px-10 py-4 text-base": props.size === "large",
      "w-10 h-10 p-0": props.size === "icon",
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
          class={
            "flex items-center justify-center absolute inset-0 z-10 rounded-md bg-primary bg-opacity-40"
          }
        >
          <div class="w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
        </div>
      </Show>
      {props.children}
    </button>
  );
};

export default Button;
