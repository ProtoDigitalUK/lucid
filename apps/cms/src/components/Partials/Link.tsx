import T from "@/translations";
import { Component, JSX, createMemo } from "solid-js";
import classnames from "classnames";
import { Link as RouterLink } from "@solidjs/router";
import spawnToast from "@/utils/spawn-toast";

interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  theme:
    | "primary"
    | "primary-outline"
    | "container-outline"
    | "danger"
    | "basic";
  size: "x-small" | "small" | "medium" | "large" | "icon" | "auto";
  children: JSX.Element;

  replace?: boolean;
  href?: string;
  classes?: string;
  permission?: boolean;
}

const Link: Component<LinkProps> = (props) => {
  // ----------------------------------------
  // Memos
  const classes = createMemo(() => {
    return classnames(
      "flex items-center justify-center text-center focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative font-medium",
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
        "p-1": props.size === "auto",
        "opacity-80 cursor-not-allowed": props.permission === false,
      }
    );
  });

  // ----------------------------------------
  // Render
  return (
    <RouterLink
      class={classnames(classes(), props.classes)}
      href={props.href || ""}
      replace={props.replace}
      {...props}
      onClick={(e) => {
        if (props.permission === false) {
          spawnToast({
            title: T("no_permission_toast_title"),
            message: T("no_permission_toast_message"),
            status: "warning",
          });
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {props.children}
    </RouterLink>
  );
};

export default Link;
