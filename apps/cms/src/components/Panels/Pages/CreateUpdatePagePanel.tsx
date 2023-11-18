import T from "@/translations";
import {
  Component,
  createMemo,
  createSignal,
  createEffect,
  Accessor,
} from "solid-js";
// Services
import api from "@/services/api";
// Utils
import helpers from "@/utils/helpers";
// Stores
import { environment } from "@/store/environmentStore";
import contentLanguageStore from "@/store/contentLanguageStore";
// Types
import type { CollectionResT } from "@lucid/types/src/collections";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { PagesResT } from "@lucid/types/src/pages";
// Components
import Panel from "@/components/Groups/Panel";
import PageFieldGroup, {
  setDefualtTranslations,
  parseTranslationBody,
} from "@/components/FieldGroups/Page";

interface CreateUpdatePagePanelProps {
  id?: Accessor<number | undefined>;
  collection: CollectionResT;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const CreateUpdatePagePanel: Component<CreateUpdatePagePanelProps> = (
  props
) => {
  // ------------------------------
  // State
  const [getTranslations, setTranslations] = createSignal<
    PagesResT["translations"]
  >([]);
  const [getParentId, setParentId] = createSignal<number | undefined>(
    undefined
  );
  const [getIsHomepage, setIsHomepage] = createSignal<boolean>(false);
  const [getSelectedCategories, setSelectedCategories] = createSignal<
    SelectMultipleValueT[]
  >([]);
  const [getSelectedAuthor, setSelectedAuthor] = createSignal<
    number | undefined
  >(undefined);

  // ---------------------------------
  // Memos
  const panelMode = createMemo(() => {
    if (props.id === undefined) return "create";
    return "update";
  });
  const languages = createMemo(() => contentLanguageStore.get.languages);

  // ---------------------------------
  // Queries
  const categories = api.environment.collections.categories.useGetMultiple({
    queryParams: {
      filters: {
        collection_key: props.collection.key,
      },
      headers: {
        "lucid-environment": environment,
      },
      perPage: -1,
    },
  });

  const page = api.environment.collections.pages.useGetSingle({
    queryParams: {
      location: {
        id: props?.id,
      },
      includes: {
        bricks: false,
      },
      headers: {
        "lucid-environment": environment,
      },
    },
    enabled: () => panelMode() === "update" && !!props.id?.(),
  });

  // ---------------------------------
  // Mutations
  const createPage = api.environment.collections.pages.useCreateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
    collectionName: props.collection.singular,
  });

  const updatePage = api.environment.collections.pages.useUpdateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
    collectionName: props.collection.singular,
  });

  // ---------------------------------
  // Memos
  const updateData = createMemo(() => {
    return helpers.updateData(
      {
        homepage: page.data?.data.homepage,
        parent_id: page.data?.data.parent_id || null,
        category_ids: page.data?.data.categories || [],
        author_id: page.data?.data.author?.id || null,
        translations: page.data?.data.translations || [],
      },
      {
        homepage: getIsHomepage(),
        parent_id: getParentId() || null,
        category_ids: getSelectedCategories().map(
          (cat) => cat.value
        ) as number[],
        author_id: getSelectedAuthor() || null,
        translations: getTranslations(),
      }
    );
  });

  const fetchIsLoading = createMemo(() => {
    if (panelMode() === "create") return categories.isLoading;
    return categories.isLoading || page.isLoading;
  });

  const fetchIsError = createMemo(() => {
    if (panelMode() === "create") return categories.isError;
    return categories.isError || page.isError;
  });

  const mutateIsLoading = createMemo(() => {
    if (panelMode() === "create") return createPage.action.isLoading;
    return updatePage.action.isLoading;
  });

  const mutateErrors = createMemo(() => {
    if (panelMode() === "create") return createPage.errors();
    return updatePage.errors();
  });

  const panelContent = createMemo(() => {
    if (panelMode() === "create") {
      return {
        title: T("create_page_panel_title", {
          name: props.collection.singular,
        }),
        description: T("create_page_panel_description", {
          collection: {
            value: props.collection.title,
            toLowerCase: true,
          },
        }),
        submit: T("create"),
      };
    }
    return {
      title: T("update_page_panel_title", {
        name: props.collection.singular,
      }),
      description: T("update_page_panel_description", {
        collection: {
          value: props.collection.singular,
          toLowerCase: true,
        },
      }),
      submit: T("update"),
    };
  });

  const hasTranslationErrors = createMemo(() => {
    const errors = mutateErrors()?.errors?.body?.translations.children;
    if (errors) {
      return errors.length > 0;
    }
    return false;
  });

  // ---------------------------------
  // Functions

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (page.isSuccess && categories.isSuccess) {
      setParentId(page.data?.data.parent_id || undefined);
      setIsHomepage(page.data?.data.homepage || false);
      setTranslations(
        setDefualtTranslations({
          translations: page.data?.data.translations || [],
          languages: languages(),
        })
      );
      setSelectedCategories(
        categories.data?.data
          .filter((cat) => {
            return page.data?.data.categories?.includes(cat.id);
          })
          ?.map((cat) => {
            return {
              value: cat.id,
              label: cat.title,
            };
          }) || []
      );
      setSelectedAuthor(page.data?.data.author?.id || undefined);
    }
  });

  createEffect(() => {
    if (panelMode() !== "create") return;
    if (getTranslations().length > 0) return;
    setTranslations(
      setDefualtTranslations({
        translations: [],
        languages: languages(),
      })
    );
  });

  createEffect(() => {
    if (getIsHomepage()) {
      setParentId(undefined);
    }
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        if (panelMode() === "update") {
          const body = updateData().data;
          updatePage.action.mutate({
            id: props.id?.() as number,
            body: {
              homepage: body.homepage,
              parent_id: body.parent_id,
              category_ids: body.category_ids,
              author_id: body.author_id,
              translations: parseTranslationBody({
                translations: body.translations,
                isHomepage: getIsHomepage(),
              }),
            },
            headers: {
              "lucid-environment": environment() || "",
            },
          });
        } else {
          createPage.action.mutate({
            body: {
              translations:
                parseTranslationBody({
                  translations: getTranslations(),
                  isHomepage: getIsHomepage(),
                }) || [],
              collection_key: props.collection.key,
              homepage: getIsHomepage(),
              parent_id: getParentId(),
              category_ids: getSelectedCategories().map(
                (cat) => cat.value
              ) as number[],
            },
            headers: {
              "lucid-environment": environment() as string,
            },
          });
        }
      }}
      reset={() => {
        updatePage.reset();
        createPage.reset();
        setTranslations([]);
        setParentId(undefined);
        setIsHomepage(false);
        setSelectedCategories([]);
      }}
      mutateState={{
        isLoading: mutateIsLoading(),
        errors: mutateErrors(),
        isDisabled: panelMode() === "update" && !updateData().changed,
      }}
      fetchState={{
        isLoading: fetchIsLoading(),
        isError: fetchIsError(),
      }}
      content={panelContent()}
      langauge={{
        contentLanguage: true,
        hasContentLanguageError: hasTranslationErrors(),
        useDefaultContentLanguage: panelMode() === "create",
      }}
    >
      {(lang) => (
        <PageFieldGroup
          mode={panelMode()}
          showTitles={true}
          state={{
            pageId: props.id,
            contentLanguage: lang?.contentLanguage,
            mutateErrors,
            collection: props.collection,
            categories: categories.data?.data || [],
            getTranslations,
            getIsHomepage,
            getParentId,
            getSelectedCategories,
            getSelectedAuthor,
          }}
          setState={{
            setTranslations,
            setIsHomepage,
            setParentId,
            setSelectedCategories,
            setSelectedAuthor,
          }}
        />
      )}
    </Panel.Root>
  );
};

export default CreateUpdatePagePanel;
