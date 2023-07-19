import { Component } from "solid-js";
// Components
import Spinner from "@/components/Partials/Spinner";

interface LoadingProps {
  type: "fill";
}

const Loading: Component<LoadingProps> = (props) => {
  if (props.type === "fill") {
    return (
      <div class="inset-0 absolute flex items-center justify-center z-50 skeleton-loader">
        <Spinner size="md" />
      </div>
    );
  }

  return null;
};

export default Loading;
