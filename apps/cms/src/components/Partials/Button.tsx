import { Component, Accessor, Show } from "solid-js";
import classnames from "classnames";

interface ButtonProps {
  text: string;

  classes?: string;
  type?: "button" | "submit" | "reset";
  colour?: "primary" | "secondary" | "error";

  loading?: Accessor<boolean>;
}

const Button: Component<ButtonProps> = ({
  text,
  colour,
  classes = "",
  type = "button",
  loading,
}) => {
  // ----------------------------------------
  // Classes
  const buttonClasses = classnames(
    "px-10 py-3.5 focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative",
    {
      "bg-primary hover:bg-primaryH text-white ring-secondary":
        colour === "primary",
    }
  );

  // ----------------------------------------
  // Render
  return (
    <button type={type} class={classnames(buttonClasses, classes)}>
      <Show when={loading !== undefined && loading()}>
        <div
          class={classnames(
            "flex items-center justify-center absolute inset-0 z-10 rounded-md",
            {
              "bg-primary bg-opacity-80": colour === "primary",
            }
          )}
        >
          <div class="w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
        </div>
      </Show>
      {text}
    </button>
  );
};

export default Button;
