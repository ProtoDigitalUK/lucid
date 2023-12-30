import { Component, Accessor, createMemo, Setter, For, Show } from "solid-js";
// Stores
import contentLanguageStore from "@/store/contentLanguageStore";
import builderStore from "@/store/builderStore";
// Types
import type { APIErrorResponse } from "@/types/api";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { PagesResT } from "@headless/types/src/pages";
import type { BrickConfigT } from "@headless/types/src/bricks";
import type {
  CollectionCategoriesResT,
  CollectionResT,
} from "@headless/types/src/collections";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import PageFieldGroup from "@/components/FieldGroups/Page";
import classNames from "classnames";

interface SidebarProps {
  mode: "single" | "multiple";
  state: {
    brickConfig: BrickConfigT[];
    pageId?: number;
    collection: CollectionResT;
    categories?: CollectionCategoriesResT[];
    mutateErrors: Accessor<APIErrorResponse | undefined>;
    getTranslations?: Accessor<PagesResT["translations"]>;
    getParentId?: Accessor<number | undefined>;
    getIsHomepage?: Accessor<boolean>;
    getSelectedCategories?: Accessor<SelectMultipleValueT[]>;
    getSelectedAuthor?: Accessor<number | undefined>;
  };
  setState?: {
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
  const fixedBricks = createMemo(() =>
    builderStore.get.bricks
      .filter((brick) => brick.type === "fixed")
      .sort((a, b) => a.order - b.order)
  );
  const sidebarBricks = createMemo(() =>
    fixedBricks().filter((brick) => brick.position === "sidebar")
  );

  // ----------------------------------
  // Render
  return (
    <div
      class={classNames("max-h-screen overflow-y-auto hide-scrollbar", {
        "w-15": props.mode === "single" && sidebarBricks().length === 0,
        "w-[500px] p-15":
          props.mode === "multiple" || sidebarBricks().length > 0,
      })}
    >
      <ul>
        <Show when={props.mode === "multiple"}>
          <li class="w-full p-15 bg-container border border-border rounded-md mb-15">
            <PageFieldGroup
              mode={"update"}
              showTitles={false}
              theme="basic"
              state={{
                pageId: pageId,
                contentLanguage: contentLanguage,
                mutateErrors: props.state.mutateErrors,
                collection: props.state.collection,
                categories: props.state.categories || [],
                getTranslations: props.state.getTranslations as Accessor<
                  PagesResT["translations"]
                >,
                getIsHomepage: props.state.getIsHomepage as Accessor<boolean>,
                getParentId: props.state.getParentId as Accessor<
                  number | undefined
                >,
                getSelectedCategories: props.state
                  .getSelectedCategories as Accessor<SelectMultipleValueT[]>,
                getSelectedAuthor: props.state.getSelectedAuthor as Accessor<
                  number | undefined
                >,
              }}
              setState={{
                setTranslations: props.setState?.setTranslations as Setter<
                  PagesResT["translations"]
                >,
                setIsHomepage: props.setState?.setIsHomepage as Setter<boolean>,
                setParentId: props.setState?.setParentId as Setter<
                  number | undefined
                >,
                setSelectedCategories: props.setState
                  ?.setSelectedCategories as Setter<SelectMultipleValueT[]>,
                setSelectedAuthor: props.setState?.setSelectedAuthor as Setter<
                  number | undefined
                >,
              }}
            />
          </li>
        </Show>
        <For each={sidebarBricks()}>
          {(brick) => (
            <PageBuilder.Brick
              state={{
                brick,
                brickConfig: props.state.brickConfig,
                alwaysOpen: true,
              }}
            />
          )}
        </For>
      </ul>
    </div>
  );
};
