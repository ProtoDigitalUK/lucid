import classNames from "classnames";
import { Component, JSXElement } from "solid-js";

interface AspectRatioProps {
  ratio: "1:1" | "4:3" | "16:9" | "21:9";
  children: JSXElement;
}

const AspectRatio: Component<AspectRatioProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <div
      class={classNames("relative w-full after:block", {
        "after:pb-[100%]": props.ratio === "1:1",
        "after:pb-[75%]": props.ratio === "4:3",
        "after:pb-[56.25%]": props.ratio === "16:9",
        "after:pb-[42.85%]": props.ratio === "21:9",
      })}
    >
      <div class="absolute inset-0">{props.children}</div>
    </div>
  );
};

export default AspectRatio;
