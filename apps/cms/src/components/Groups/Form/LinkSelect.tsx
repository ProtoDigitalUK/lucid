import T from "@/translations";
import { Component, Match, Switch } from "solid-js";
import classNames from "classnames";
import { FaSolidPen } from "solid-icons/fa";
// Types
import type {
  PageLinkValueT,
  LinkValueT,
  PageLinkMetaT,
} from "@headless/types/src/bricks";
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
  onChange: (
    _value: PageLinkValueT | LinkValueT | null,
    _meta?: PageLinkMetaT | null
  ) => void;
  meta: PageLinkMetaT | null;
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
      onSelectCallback: (link, meta) => {
        props.onChange(link, meta);
      },
      type: props.type,
      open: true,
      selectedPageLink:
        props.type === "pagelink" ? (props.value as PageLinkValueT) : null,
      selectedLink: props.type === "link" ? (props.value as LinkValueT) : null,
      selectedMeta: props.meta,
    });
  };

  // -------------------------------
  // Memos
  const linkLabel = () => {
    if (props.type === "pagelink") {
      return props.value?.label;
    }
    const value = props.value as LinkValueT;
    return value?.label || value?.url;
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
      <div class="mt-2.5 w-full flex flex-wrap gap-2.5">
        <Switch>
          <Match when={!linkLabel()}>
            <Button
              type="button"
              theme="container-outline"
              size="x-small"
              onClick={openLinkModal}
            >
              {T("select_link")}
            </Button>
          </Match>
          <Match when={props.value}>
            <button
              type="button"
              onClick={openLinkModal}
              class="flex cursor-pointer font-semibold items-center py-2 px-2.5 border-primary text-primary border text-sm rounded-md hover:bg-primaryH hover:text-primaryText transition-colors duration-200 ease-in-out"
            >
              <span class="line-clamp-1">{linkLabel()}</span>
              <span class="ml-2.5 flex items-center border-l border-current pl-2.5">
                <FaSolidPen size={12} class="fill-current" />
              </span>
            </button>
            <button
              type="button"
              class="hover:text-error text-primary flex items-center text-sm lowercase"
              onClick={() => {
                props.onChange(null, null);
              }}
            >
              {T("clear")}
            </button>
          </Match>
        </Switch>
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
