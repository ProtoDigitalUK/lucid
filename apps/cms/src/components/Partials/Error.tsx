import { Component, Show } from "solid-js";
import classNames from "classnames";
// Components
import Link from "@/components/Partials/Link";

interface ErrorProps {
  type: "fill";
  content: {
    image: string;
    title: string;
    description: string;
  };
  link?: {
    text: string;
    href: string;
  };
}

const Error: Component<ErrorProps> = (props) => {
  return (
    <div
      class={classNames("flex items-center justify-center", {
        "inset-0 absolute z-50": props.type === "fill",
      })}
    >
      <div class="text-center max-w-xl flex flex-col items-center">
        <img
          src={props.content.image}
          class="h-auto mx-auto mb-10 max-w-xs w-full max-h-40 object-contain"
        />
        <h2 class="mb-2">{props.content.title}</h2>
        <p class="">{props.content.description}</p>
        <Show when={props.link !== undefined}>
          <Link theme={"primary"} class="mt-10" href={props.link?.href || ""}>
            {props.link?.text || ""}
          </Link>
        </Show>
      </div>
    </div>
  );
};

export default Error;
