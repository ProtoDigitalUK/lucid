import { Component } from "solid-js";

interface LoadingProps {
  type: "fill";
}

const Loading: Component<LoadingProps> = (props) => {
  if (props.type === "fill") {
    return (
      <div class="inset-0 absolute bg-white flex items-center justify-center z-50">
        One moment please... (CHANGE ME)
      </div>
    );
  }

  return null;
};

export default Loading;
