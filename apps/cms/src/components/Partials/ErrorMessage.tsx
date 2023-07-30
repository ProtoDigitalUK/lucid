import { Component } from "solid-js";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: Component<ErrorMessageProps> = (props) => {
  if (!props.message) return null;

  return (
    <div class="bg-container rounded-r-md border-l-4 border-l-error p-2.5 border border-border">
      <p>{props.message}</p>
    </div>
  );
};

export default ErrorMessage;
