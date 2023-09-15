import classNames from "classnames";
import { Component, JSXElement } from "solid-js";

export interface PillProps {
  theme: "primary" | "secondary" | "grey" | "green" | "red" | "warning";
  children: JSXElement;
}

const Pill: Component<PillProps> = (props) => {
  // ----------------------------------
  // Return
  return (
    <span
      class={classNames(
        "rounded-full px-3 py-1 text-xs font-medium inline-flex whitespace-nowrap",
        {
          "bg-primary text-primaryText": props.theme === "primary",
          "bg-secondary text-secondaryText": props.theme === "secondary",
          "bg-backgroundAccent text-title": props.theme === "grey",
          "bg-success text-white": props.theme === "green",
          "bg-error text-white": props.theme === "red",
          "bg-warning text-title": props.theme === "warning",
        }
      )}
    >
      {props.children}
    </span>
  );
};

export default Pill;
