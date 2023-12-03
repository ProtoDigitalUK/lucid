import T from "@/translations";
import { Component } from "solid-js";
import classNames from "classnames";
// Types
import type { PageLinkValueT, LinkValueT } from "@headless/types/src/bricks";
import type { ErrorResult, FieldError } from "@/types/api";
// Store
import linkFieldStore from "@/store/linkFieldStore";
// Components
import Button from "@/components/Partials/Button";
import Form from "@/components/Groups/Form";

interface LinkSelectProps {
  id: string;
  type: "pagelink" | "link";
  value: PageLinkValueT | LinkValueT | undefined | null;
  onChange: (_value: PageLinkValueT | LinkValueT | null) => void;
  copy?: {
    label?: string;
    describedBy?: string;
  };
  noMargin?: boolean;
  required?: boolean;
  errors?: ErrorResult | FieldError;
}

export const LinkSelect: Component<LinkSelectProps> = (props) => {
  // -------------------------------
  // Functions
  const openLinkModal = () => {
    linkFieldStore.set({
      onSelectCallback: (link) => {
        props.onChange(link);
      },
      type: props.type,
      open: true,
    });
  };

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
        <Button
          type="button"
          theme="container-outline"
          size="x-small"
          onClick={openLinkModal}
        >
          {T("select_link")}
        </Button>
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
