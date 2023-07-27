import { Component, JSX } from "solid-js";
import classnames from "classnames";
import { Link as RouterLink } from "@solidjs/router";

interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: JSX.Element;
  href?: string;
  theme?: "primary" | "primary-slim-outline";
}

const Link: Component<LinkProps> = (props) => {
  // ----------------------------------------
  // Classes
  const linkClasses = classnames(
    "focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative",
    {
      "primary-btn": props.theme === "primary",
      "primary-slim-outline-btn": props.theme === "primary-slim-outline",
    }
  );

  // ----------------------------------------
  // Render
  return (
    <RouterLink
      class={classnames(linkClasses)}
      href={props.href || ""}
      {...props}
    >
      {props.children}
    </RouterLink>
  );
};

export default Link;
