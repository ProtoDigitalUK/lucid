import T from "@/translations";
import { Component } from "solid-js";
import classNames from "classnames";
// Types
import type { ErrorResult, FieldError } from "@/types/api";
// Components
import Button from "@/components/Partials/Button";
import Form from "@/components/Groups/Form";

interface MediaSelectProps {
  id: string;
  // value: string;
  // onChange: (_value: string) => void;
  copy?: {
    label?: string;
    describedBy?: string;
  };
  noMargin?: boolean;
  required?: boolean;
  errors?: ErrorResult | FieldError;
}

export const MediaSelect: Component<MediaSelectProps> = (props) => {
  // -------------------------------
  // Render
  return (
    <div
      class={classNames("w-full", {
        "mb-0": props.noMargin,
        "mb-2.5 last:mb-0": !props.noMargin,
      })}
    >
      <Form.Label
        id={props.id}
        label={props.copy?.label}
        required={props.required}
        theme={"basic"}
      />
      <div class="mt-2.5 w-full">
        <Button type="submit" theme="primary" size="x-small">
          {T("select_media")}
        </Button>
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
