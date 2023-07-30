import { Component } from "solid-js";

interface SectionHeadingProps {
  title: string;
  description?: string;
}

const SectionHeading: Component<SectionHeadingProps> = (props) => {
  return (
    <div class="flex flex-col mb-15">
      <h2 class="text-lg">{props.title}</h2>
      {props.description && <p class="mt-2.5">{props.description}</p>}
    </div>
  );
};

export default SectionHeading;
