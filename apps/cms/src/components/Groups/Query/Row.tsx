import { Component, JSXElement } from "solid-js";

interface QueryRowProps {
  children: JSXElement;
}

export const QueryRow: Component<QueryRowProps> = (props) => {
  return <div class="w-full px-15 md:px-30 pb-2.5">{props.children}</div>;
};
