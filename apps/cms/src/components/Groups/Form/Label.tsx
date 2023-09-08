import { Component, Show } from "solid-js";
import classnames from "classnames";

interface LabelProps {
  id: string;
  label?: string;
  focused?: boolean;
  required?: boolean;
  noPadding?: boolean;
}

export const Label: Component<LabelProps> = (props) => {
  return (
    <Show when={props?.label !== undefined}>
      <label
        for={props.id}
        class={classnames(
          "block text-sm transition-colors duration-200 ease-in-out",
          {
            "text-secondaryH": props.focused,
            "pt-2 px-2.5": props.noPadding !== true,
            "mb-2": props.noPadding === true,
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
