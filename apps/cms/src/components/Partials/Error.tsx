import { Component } from "solid-js";
import classNames from "classnames";

interface ErrorProps {
  type: "fill";
  content: {
    image: string;
    title: string;
    description: string;
  };
}

const Error: Component<ErrorProps> = (props) => {
  return (
    <div
      class={classNames("flex items-center justify-center", {
        "inset-0 absolute z-50": props.type === "fill",
      })}
    >
      <div class="text-center">
        <img
          src={props.content.image}
          class="h-auto mx-auto mb-10 max-w-xs w-full max-h-40 object-contain"
        />
        <h1 class="mb-2">{props.content.title}</h1>
        <p class="">{props.content.description}</p>
      </div>
    </div>
  );
};

export default Error;
