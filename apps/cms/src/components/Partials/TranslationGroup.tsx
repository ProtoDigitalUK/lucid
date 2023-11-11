import { Component, JSXElement } from "solid-js";

interface TranslationGroupProps {
  name: string | null;
  code: string;
  children: JSXElement;
}

const TranslationGroup: Component<TranslationGroupProps> = (props) => {
  // ------------------------------
  // Render
  return (
    <div class="mb-15 last:mb-0">
      <h4 class="mb-2.5">
        {props.name ? `${props.name} (${props.code})` : props.code}
      </h4>
      <div class="bg-backgroundAccent p-15 rounded-md">{props.children}</div>
    </div>
  );
};

export default TranslationGroup;
