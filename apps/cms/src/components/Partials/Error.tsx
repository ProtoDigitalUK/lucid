import { Component, JSXElement, Show } from "solid-js";
import classNames from "classnames";
// Components
import Link from "@/components/Partials/Link";

interface ErrorProps {
  type: "fill" | "page-layout" | "table";
  content: {
    image: string;
    title: string;
    description: string;
  };
  link?: {
    text: string;
    href: string;
  };
  children?: JSXElement;
}

const Error: Component<ErrorProps> = (props) => {
  return (
    <div
      class={classNames("flex items-center justify-center bg-background", {
        "inset-0 absolute z-50": props.type === "fill",
        "page-layout-full-body": props.type === "page-layout",
        "border-t border-border page-layout-table": props.type === "table",
      })}
    >
      <div class="text-center max-w-xl flex flex-col items-center p-10">
        <img
          src={props.content.image}
          class="h-auto mx-auto mb-10 max-w-xs w-full max-h-40 object-contain"
        />
        <h2 class="mb-2">{props.content.title}</h2>
        <p class="max-w-[400px]">{props.content.description}</p>
        <Show when={props.link !== undefined}>
          <Link
            theme={"primary"}
            size="medium"
            classes="mt-10"
            href={props.link?.href || ""}
          >
            {props.link?.text || ""}
          </Link>
        </Show>
        <Show when={props.children}>
          <div class="mt-10">{props.children}</div>
        </Show>
      </div>
    </div>
  );
};

export default Error;
