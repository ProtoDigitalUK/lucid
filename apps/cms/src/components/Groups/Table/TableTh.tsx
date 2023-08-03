import classNames from "classnames";
import { Component, JSXElement } from "solid-js";

interface TableThProps {
  index: number;
  label: string;
  key: string;
  icon?: JSXElement;
  sortable?: boolean;
  include: boolean;
}

export const TableTh: Component<TableThProps> = (props) => {
  return (
    <th
      class={classNames("text-left", {
        hidden: !props.include,
      })}
    >
      {props.label}
    </th>
  );
};
