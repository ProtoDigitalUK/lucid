import { Component, Accessor, createMemo, Setter } from "solid-js";
// Stores
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import type { APIErrorResponse } from "@/types/api";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { PagesResT } from "@lucid/types/src/pages";
import type {
  CollectionCategoriesResT,
  CollectionResT,
} from "@lucid/types/src/collections";
// Components
import PageFieldGroup from "@/components/FieldGroups/Page";

interface SidebarProps {
  state: {
    pageId?: number;
    collection: CollectionResT;
    categories: CollectionCategoriesResT[];
    mutateErrors: Accessor<APIErrorResponse | undefined>;
    // Page Details
    getTranslations: Accessor<PagesResT["translations"]>;
    getParentId: Accessor<number | undefined>;
    getIsHomepage: Accessor<boolean>;
    getSelectedCategories: Accessor<SelectMultipleValueT[]>;
    getSelectedAuthor: Accessor<number | undefined>;
  };
  setState: {
    // Page Details
    setTranslations: Setter<PagesResT["translations"]>;
    setParentId: Setter<number | undefined>;
    setIsHomepage: Setter<boolean>;
    setSelectedCategories: Setter<SelectMultipleValueT[]>;
    setSelectedAuthor: Setter<number | undefined>;
  };
}

export const Sidebar: Component<SidebarProps> = (props) => {
  // ------------------------------
  // Memos
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );
  const pageId = createMemo(() => props.state.pageId);

  // ----------------------------------
  // Render
  return (
    <>
      <div class="w-full p-15 bg-container border border-border rounded-md mb-15">
        <PageFieldGroup
          mode={"update"}
          showTitles={false}
          theme="basic"
          state={{
            pageId: pageId,
            contentLanguage: contentLanguage,
            mutateErrors: props.state.mutateErrors,
            collection: props.state.collection,
            categories: props.state.categories,
            getTranslations: props.state.getTranslations,
            getIsHomepage: props.state.getIsHomepage,
            getParentId: props.state.getParentId,
            getSelectedCategories: props.state.getSelectedCategories,
            getSelectedAuthor: props.state.getSelectedAuthor,
          }}
          setState={{
            setTranslations: props.setState.setTranslations,
            setIsHomepage: props.setState.setIsHomepage,
            setParentId: props.setState.setParentId,
            setSelectedCategories: props.setState.setSelectedCategories,
            setSelectedAuthor: props.setState.setSelectedAuthor,
          }}
        />
      </div>
      <div>sidebar bricks</div>
    </>
  );
};
