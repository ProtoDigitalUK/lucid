import { Component } from "solid-js";
// Components
import Layout from "@/components/Groups/Layout";

interface PaginationProps {
  data: {
    meta: APIResponse<any>["meta"];
  };
}

export const Pagination: Component<PaginationProps> = (props) => {
  return (
    <Layout.PageFooter>
      <div class="flex justify-between">
        <p class="text-sm">Showing 1 to 10 of 97 results</p>
      </div>
    </Layout.PageFooter>
  );
};
