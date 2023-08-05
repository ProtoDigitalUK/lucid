import classNames from "classnames";
import { Component, JSXElement, Switch, Match } from "solid-js";

interface ThProps {
  key?: string;
  index?: number;
  classes?: string;
  icon?: JSXElement;
  label?: string;

  options?: {
    include?: boolean;
    width?: number;
    sortable?: boolean;
  };
  children?: JSXElement;
}

// Head Column

export const Th: Component<ThProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <th
      class={classNames(
        "text-left first:pl-30 last:pr-30 px-15 hover:bg-backgroundAccent rounded-md bg-background duration-200 transition-colors whitespace-nowrap",
        {
          hidden: props.options?.include === false,
        },
        props?.classes
      )}
      style={{
        width: props.options?.width ? `${props.options.width}px` : undefined,
      }}
    >
      <Switch>
        <Match when={props?.label !== undefined}>
          <div class="flex justify-between">
            <div class="flex items-center">
              <span class="text-sm mr-2.5 fill-body">{props?.icon}</span>
              <span class="text-sm text-body">{props?.label}</span>
            </div>
          </div>
        </Match>
        <Match when={props.children !== undefined}>{props.children}</Match>
      </Switch>
    </th>
  );
};
