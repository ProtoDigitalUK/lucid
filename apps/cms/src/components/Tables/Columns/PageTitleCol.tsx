import { Component } from "solid-js";
// Components
import Table from "@/components/Groups/Table";

interface PageTitleColProps {
  title: string;
  fullSlug: string;
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
        <span>{props.title}</span>
        <span class="text-sm mt-1 text-unfocused">{props.fullSlug}</span>
      </div>
    </Table.Td>
  );
};

export default PageTitleCol;
