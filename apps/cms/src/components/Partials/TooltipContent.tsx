import { Component } from "solid-js";
// Components
import { Tooltip } from "@kobalte/core";

interface TooltipContentProps {
  text: string;
}

const TooltipContent: Component<TooltipContentProps> = (props) => {
  return (
    <Tooltip.Content class="bg-primary text-white rounded-md text-sm px-2 py-1 shadow-md animate-animate-from-left">
      <Tooltip.Arrow class="text-primary" size={20} />
      {props.text}
    </Tooltip.Content>
  );
};

export default TooltipContent;
