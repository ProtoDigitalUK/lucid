import T from "@/translations";
import { Component, Show, JSX, createMemo } from "solid-js";
import classnames from "classnames";
import spawnToast from "@/utils/spawn-toast";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  theme:
    | "primary"
    | "primary-outline"
    | "container-outline"
    | "danger"
    | "basic"
    | "secondary-toggle";
  size: "x-small" | "small" | "medium" | "large" | "icon" | "auto";
  children: JSX.Element;

  onCLick?: () => void;
  type?: "button" | "submit" | "reset";
  classes?: string;
  loading?: boolean;
  disabled?: boolean;
  active?: boolean;
  permission?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
  // ----------------------------------------
  // Memos
  const classes = createMemo(() => {
    return classnames(
      "flex items-center justify-center text-center focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative disabled:cursor-not-allowed disabled:opacity-80 font-medium",
      {
        "bg-primary hover:bg-primaryH text-primaryText hover:text-white fill-primaryText hover:fill-white ring-secondary":
          props.theme === "primary",
        "bg-transparent border border-primaryA hover:bg-primaryH fill-primaryText text-primaryText hover:text-primaryText":
          props.theme === "primary-outline",
        "bg-container border border-primary hover:bg-primaryH fill-primaryText text-title hover:text-primaryText":
          props.theme === "container-outline",
        "bg-error hover:bg-errorH text-errorText ring-secondary fill-errorText":
          props.theme === "danger",

        // Toggles
        "ring-secondary": props.theme === "secondary-toggle",
        "bg-primary text-primaryText fill-primaryText hover:bg-primaryH border-primaryA border":
          props.theme === "secondary-toggle" && !props.active,
        "bg-secondary text-secondaryText fill-secondaryText hover:bg-secondaryH border-secondary border":
          props.theme === "secondary-toggle" && props.active,

        // Sizes
        "px-2.5 py-2 text-sm": props.size === "x-small",
        "px-5 py-2.5 text-base": props.size === "small",
        "px-5 py-3.5 text-base": props.size === "medium",
        "px-10 py-4 text-base": props.size === "large",
        "w-10 h-10 p-0": props.size === "icon",
        "p-1": props.size === "auto",
        "opacity-80 cursor-not-allowed": props.permission === false,
      }
    );
  });

  // ----------------------------------------
  // Render
  return (
    <button
      type={props.type}
      class={classnames(classes(), props.classes)}
      onClick={(e) => {
        if (props.permission === false) {
          spawnToast({
            title: T("no_permission_toast_title"),
            message: T("no_permission_toast_message"),
            status: "warning",
          });
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        props.onCLick && props.onCLick();
      }}
      disabled={props.disabled || props.loading}
      {...props}
    >
      <Show when={props.loading !== undefined && props.loading}>
        <div
          class={
            "flex items-center justify-center absolute inset-0 z-10 rounded-md bg-primary bg-opacity-40"
          }
        >
          <div class="w-4 h-4 border-2 border-white rounded-full animate-spin" />
        </div>
      </Show>
      {props.children}
    </button>
  );
};

export default Button;
