import { Component } from "solid-js";
import classNames from "classnames";

interface ErrorMessageProps {
  message?: string;
  theme: "basic" | "background" | "container";
}

const ErrorMessage: Component<ErrorMessageProps> = (props) => {
  if (!props.message) return null;

  return (
    <div
      class={classNames("mb-5 last:mb-0", {
        "bg-container rounded-r-md border-l-4 border-l-error p-2.5 border border-border":
          props.theme === "background", // on background colour
        "bg-backgroundAccent rounded-r-md border-l-4 border-l-error p-2.5 bg-opacity-40 border-border border":
          props.theme === "container", // on container colour
      })}
    >
      <p
        class={classNames({
          "text-errorH": props.theme === "basic", // on basic colour
        })}
      >
        {props.message}
      </p>
    </div>
  );
};

export default ErrorMessage;
