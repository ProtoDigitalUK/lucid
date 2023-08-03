import classNames from "classnames";
import { Component, JSXElement } from "solid-js";

interface TableTdProps {
  include: boolean;
  children: JSXElement;
}

export const TableTd: Component<TableTdProps> = (props) => {
  return (
    <td
      class={classNames({
        hidden: !props.include,
      })}
    >
      {props.children}
    </td>
  );
};
