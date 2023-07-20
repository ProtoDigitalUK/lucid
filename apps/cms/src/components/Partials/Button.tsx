import { Component, Show } from "solid-js";
import classnames from "classnames";

interface ButtonProps {
  text: string;
  onCLick?: () => void;

  classes?: string;
  type?: "button" | "submit" | "reset";
  colour?: "primary" | "secondary" | "error";

  loading?: boolean;
  disabled?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
  // ----------------------------------------
  // Classes
  const buttonClasses = classnames(
    "px-10 py-3.5 focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative disabled:cursor-not-allowed",
    {
      "bg-primary hover:bg-primaryH text-white ring-secondary":
        props.colour === "primary",
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
    >
      <Show when={props.loading !== undefined && props.loading}>
        <div
          class={classnames(
            "flex items-center justify-center absolute inset-0 z-10 rounded-md",
            {
              "bg-primary bg-opacity-80": props.colour === "primary",
            }
          )}
        >
          <div class="w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
        </div>
      </Show>
      {props.text}
    </button>
  );
};

export default Button;
