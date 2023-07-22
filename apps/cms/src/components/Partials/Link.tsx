import { Component, JSX } from "solid-js";
import classnames from "classnames";

interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: JSX.Element;
  href?: string;
  classes?: string;
  colour?: "primary" | "secondary" | "error";
}

const Link: Component<LinkProps> = (props) => {
  // ----------------------------------------
  // Classes
  const linkClasses = classnames(
    "block px-10 py-3.5 focus:outline-none focus:ring-2 duration-200 transition-colors rounded-md font-display relative disabled:cursor-not-allowed",
    {
      "bg-primary hover:bg-primaryH text-white hover:text-white ring-secondary":
        props.colour === "primary",
    }
  );

  // ----------------------------------------
  // Render
  return (
    <a
      class={classnames(linkClasses, props.classes)}
      href={props.href}
      {...props}
    >
      {props.children}
    </a>
  );
};

export default Link;
