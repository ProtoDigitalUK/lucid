import { Component, JSXElement, Show } from "solid-js";

interface InfoRowProps {
  title: string;
  description?: string;
  permission?: boolean;

  children?: JSXElement;
}

const InfoRow: Component<InfoRowProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <Show when={props.permission !== false}>
      <div class="w-full grid grid-cols-4 gap-10">
        <div class="col-span-1">
          <h2 class="text-lg mb-1">{props.title}</h2>
          <Show when={props.description}>
            <p class="text-sm">{props.description}</p>
          </Show>
        </div>
        {props.children}
      </div>
    </Show>
  );
};

const InfoRowContent: Component<InfoRowProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <div class="col-span-3 bg-container p-15 rounded-md">
      <h3 class="text-base mb-1">{props.title}</h3>
      <Show when={props.description}>
        <p class="text-sm">{props.description}</p>
      </Show>
      <div class="mt-15">{props.children}</div>
    </div>
  );
};

export default {
  Root: InfoRow,
  Content: InfoRowContent,
};
