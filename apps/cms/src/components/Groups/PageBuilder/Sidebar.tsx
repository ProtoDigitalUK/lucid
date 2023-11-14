import T from "@/translations";
import { Component, Accessor, Show, createMemo } from "solid-js";
// Types
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { ValueT } from "@/components/Groups/Form/Select";
import type {
  CollectionResT,
  CollectionCategoriesResT,
} from "@lucid/types/src/collections";
// Components
import Form from "@/components/Groups/Form";
import ValidParentPageSearchSelect from "@/components/Partials/SearchSelects/ValidParentPageSearchSelect";
import UserSearchSelect from "@/components/Partials/SearchSelects/UserSearchSelect";

interface SidebarProps {
  data: {
    pageId: number;
    collection?: CollectionResT;
    categories: CollectionCategoriesResT[];
  };
  state: {
    getParentId: Accessor<number | undefined>;
    setParentId: (_value: ValueT) => void;
    getIsHomepage: Accessor<boolean>;
    setIsHomepage: (_value: boolean) => void;
    getSelectedCategories: Accessor<SelectMultipleValueT[]>;
    setSelectedCategories: (_value: SelectMultipleValueT[]) => void;
    getSelectedAuthor: Accessor<number | undefined>;
    setSelectedAuthor: (_value: ValueT) => void;
  };
}

export const Sidebar: Component<SidebarProps> = (props) => {
  // ----------------------------------
  // States

  // ----------------------------------
  // Memos
  const hideSetParentPage = createMemo(() => {
    return (
      props.data.collection?.disableHomepage === true ||
      props.state.getIsHomepage()
    );
  });

  // ----------------------------------
  // Render
  return (
    <>
      <h1>{T("edit_page_route_title")}</h1>
      <div class="mt-30">
        <Show when={props.data.collection?.disableHomepage !== true}>
          <Form.Checkbox
            id="homepage"
            value={props.state.getIsHomepage()}
            onChange={props.state.setIsHomepage}
            name={"homepage"}
            copy={{
              label: T("is_homepage"),
              describedBy: T("is_homepage_description"),
            }}
            errors={{}}
          />
        </Show>
        <Show when={!hideSetParentPage()}>
          <ValidParentPageSearchSelect
            pageId={props.data.pageId}
            id="parent_id"
            name="parent_id"
            collectionKey={props.data.collection?.key || ""}
            value={props.state.getParentId()}
            setValue={props.state.setParentId}
            copy={{
              label: T("parent_page"),
            }}
            errors={{}}
          />
        </Show>
        <Form.SelectMultiple
          id="category_ids"
          values={props.state.getSelectedCategories()}
          onChange={props.state.setSelectedCategories}
          name={"category_ids"}
          copy={{
            label: T("categories"),
          }}
          options={
            props.data.categories.map((cat) => {
              return {
                value: cat.id,
                label: cat.title,
              };
            }) || []
          }
          errors={{}}
        />
        <UserSearchSelect
          id="author_id"
          name="author_id"
          value={props.state.getSelectedAuthor()}
          setValue={props.state.setSelectedAuthor}
          copy={{
            label: T("author"),
          }}
          errors={{}}
        />
      </div>
    </>
  );
};
