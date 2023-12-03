import T from "@/translations";
import { useParams } from "@solidjs/router";
import {
  Component,
  Switch,
  createMemo,
  Match,
  createSignal,
  For,
} from "solid-js";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import linkFieldStore from "@/store/linkFieldStore";
import { environment } from "@/store/environmentStore";
// Services
import api from "@/services/api";
// Components
import Modal from "@/components/Groups/Modal";
import Form from "@/components/Groups/Form";
import PageSearchRow from "@/components/Rows/PageSearchRow";
import Button from "@/components/Partials/Button";

const LinkSelect: Component = () => {
  // ------------------------------
  // Memos
  const open = createMemo(() => linkFieldStore.get.open);

  // ------------------------------
  // Render
  return (
    <Modal.Root
      state={{
        open: open(),
        setOpen: () => linkFieldStore.set("open", false),
      }}
      options={{
        noPadding: true,
      }}
    >
      <Switch>
        <Match when={linkFieldStore.get.type === "pagelink"}>
          <PageLinkContent />
        </Match>
        <Match when={linkFieldStore.get.type === "link"}>
          <LinkContent />
        </Match>
      </Switch>
    </Modal.Root>
  );
};

const PageLinkContent: Component = () => {
  // ------------------------------
  // State
  const params = useParams();

  const [getPageId, setPageId] = createSignal<number>();
  const [getFullSlug, setFullSlug] = createSignal<string>("");
  const [getLabel, setLabel] = createSignal<string>("");
  const [getSearchQuery, setSearchQuery] = createSignal<string>("");
  const [getOpenInNewTab, setOpenInNewTab] = createSignal<boolean>(false);

  // ----------------------------------
  // Memos
  const collectionKey = createMemo(() => params.collectionKey);
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );

  // ----------------------------------
  // Queries
  const pages = api.environment.collections.pages.useGetMultiple({
    queryParams: {
      filters: {
        collection_key: collectionKey,
        title: getSearchQuery,
      },
      headers: {
        "headless-environment": environment,
        "headless-content-lang": contentLanguage,
      },
      perPage: 10,
    },
  });

  // ----------------------------------
  // Functions
  const updatePageLink = () => {
    linkFieldStore.get.onSelectCallback({
      id: getPageId() || null,
      target: getOpenInNewTab() ? "_blank" : "_self",
      label: getLabel(),
    });
    linkFieldStore.set("open", false);
  };

  // ------------------------------
  // Render
  return (
    <div class="p-15">
      <div class="mb-15 pb-15 border-b border-border">
        <h2>{T("set_page_link")}</h2>
      </div>
      <div class="mb-15 pb-15 border-b border-border">
        <Form.Input
          id="label"
          value={getLabel()}
          onChange={(value) => setLabel(value)}
          name={"label"}
          type="text"
          copy={{
            label: T("label"),
          }}
          required={false}
          theme={"basic"}
        />
        <Form.Checkbox
          id="open_in_new_tab"
          value={getOpenInNewTab()}
          onChange={(value) => setOpenInNewTab(value)}
          name={"open_in_new_tab"}
          copy={{
            label: T("open_in_new_tab"),
          }}
          required={false}
          theme={"basic"}
        />
      </div>
      <div class="">
        <Form.Search
          value={getSearchQuery()}
          onChange={(value) => setSearchQuery(value)}
          isLoading={pages.isLoading}
        />
        <div class=" mt-2.5">
          <Switch>
            <Match when={pages.data?.data.length === 0}>
              <div class="text-center text-sm text-error border border-border p-15 rounded-md">
                {T("no_results")}
              </div>
            </Match>
            <Match when={pages.data?.data && pages.data?.data.length > 0}>
              <ul class="border border-border max-h-52 overflow-y-auto rounded-md">
                <For each={pages.data?.data}>
                  {(page) => (
                    <PageSearchRow
                      page={page}
                      contentLanguage={contentLanguage()}
                      onClick={(value: { slug: string; id: number }) => {
                        setFullSlug(value.slug);
                        setPageId(value.id);
                      }}
                    />
                  )}
                </For>
              </ul>
            </Match>
          </Switch>
        </div>
        <div class="text-sm flex items-center justify-between flex-wrap mb-2.5 mt-1">
          {T("selected")}
          <span>{getFullSlug()}</span>
        </div>
      </div>
      <div class="w-full flex justify-between mt-15">
        <Button
          type="button"
          theme="container-outline"
          size="x-small"
          onClick={() => {
            linkFieldStore.set("open", false);
          }}
        >
          {T("cancel")}
        </Button>
        <Button
          type="button"
          theme="primary"
          size="x-small"
          onClick={() => {
            updatePageLink();
          }}
        >
          {T("update")}
        </Button>
      </div>
    </div>
  );
};

const LinkContent: Component = () => {
  // ------------------------------
  // Render
  return (
    <div class="p-15">
      <div class="mb-15">
        <h2>{T("set_link")}</h2>
      </div>
      Page Link Content
    </div>
  );
};

export default LinkSelect;
