import { Component, Show } from "solid-js";
// Components
import Table from "@/components/Groups/Table";

interface PageTitleColProps {
  title: string;
  slug: string;
  homepage: boolean;
  options?: {
    include?: boolean;
  };
}

const PageTitleCol: Component<PageTitleColProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <Table.Td
      options={{
        include: props?.options?.include,
      }}
    >
      <div class="flex flex-col">
        <span class="flex items-center">
          {props.title}
          <Show when={props.homepage}>
            <span class="ml-1 text-xs text-unfocused">- homepage</span>
          </Show>
        </span>
        <span class="text-sm mt-1 text-unfocused">{props.slug}</span>
      </div>
    </Table.Td>
  );
};

export default PageTitleCol;
