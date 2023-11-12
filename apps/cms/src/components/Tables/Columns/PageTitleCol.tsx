import T from "@/translations";
import { Component, Show } from "solid-js";
import { FaSolidHouse, FaSolidLanguage } from "solid-icons/fa";
// Components
import Table from "@/components/Groups/Table";

interface PageTitleColProps {
  title: {
    value: string;
    is_default: boolean;
  };
  slug: {
    value: string;
    is_default: boolean;
  };
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
          {props.title.value}
          <Show when={props.homepage}>
            <span
              class="ml-2 fill-primary block"
              title={T("this_is_the_homepage")}
            >
              <FaSolidHouse size={12} />
            </span>
          </Show>
          <Show when={props.title.is_default || props.slug.is_default}>
            <span
              class="ml-2 fill-primary block"
              title={T("either_title_or_slug_dont_have_translations")}
            >
              <FaSolidLanguage size={16} />
            </span>
          </Show>
        </span>
        <span class="text-sm mt-1 text-unfocused ">{props.slug.value}</span>
      </div>
    </Table.Td>
  );
};

export default PageTitleCol;
