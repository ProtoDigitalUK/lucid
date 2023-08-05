import classNames from "classnames";
import { Component, JSXElement } from "solid-js";

interface TdProps {
  classes?: string;
  options?: {
    include?: boolean;
    width?: number;
    noMinWidth?: boolean;
  };
  children: JSXElement;
}

// Body Column

export const Td: Component<TdProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <td
      class={classNames(
        "relative first:pl-15 md:first:pl-30 last:pr-15 md:last:pr-30 px-15 w-full after:content-[''] after:border-b after:border-border after:block after:left-0 after:right-0 after:absolute after:bottom-0",
        {
          hidden: props.options?.include === false,
        },
        props?.classes
      )}
      style={{
        width: props.options?.width ? `${props.options.width}px` : undefined,
      }}
    >
      <div
        class={classNames("min-h-[40px] py-2", {
          "w-full min-w-[100px]":
            props.options?.width === undefined && !props.options?.noMinWidth,
        })}
      >
        {props.children}
      </div>
    </td>
  );
};
