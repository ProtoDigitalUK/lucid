import classNames from "classnames";
import { Component, JSXElement } from "solid-js";

interface TdProps {
  options?: {
    include?: boolean;
    width?: number;
  };
  data?: {};
  callbacks?: {};
  children: JSXElement;
}

export const Td: Component<TdProps> = (props) => {
  return (
    <td
      class={classNames({
        hidden: props.options?.include === false,
      })}
      style={{
        width: props.options?.width ? `${props.options.width}px` : undefined,
      }}
    >
      {props.children}
    </td>
  );
};
