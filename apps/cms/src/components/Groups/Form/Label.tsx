import { Component, Show } from "solid-js";
import classnames from "classnames";

interface LabelProps {
  id: string;
  label?: string;
  focused?: boolean;
  required?: boolean;
}

export const Label: Component<LabelProps> = (props) => {
  return (
    <Show when={props?.label !== undefined}>
      <label
        for={props.id}
        class={classnames(
          "block pt-2 px-2.5 text-sm transition-colors duration-200 ease-in-out",
          {
            "text-secondaryH": props.focused,
          }
        )}
      >
        {props?.label}
        <Show when={props.required}>
          <span class="text-error ml-1 inline">*</span>
        </Show>
      </label>
    </Show>
  );
};
