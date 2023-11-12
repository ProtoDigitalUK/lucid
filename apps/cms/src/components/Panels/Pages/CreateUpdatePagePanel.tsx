import T from "@/translations";
import {
  Component,
  createMemo,
  createSignal,
  Show,
  createEffect,
  Accessor,
  Switch,
  Match,
  For,
} from "solid-js";
import slugify from "slugify";
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
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import PageSearchSelect from "@/components/Partials/SearchSelects/PageSearchSelect";
import ValidParentPageSearchSelect from "@/components/Partials/SearchSelects/ValidParentPageSearchSelect";
import UserSearchSelect from "@/components/Partials/SearchSelects/UserSearchSelect";

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
  const hideSetParentPage = createMemo(() => {
    return props.collection.disableHomepage === true || getIsHomepage();
  });

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
  const hideSlugInput = createMemo(() => {
    if (panelMode() === "create") return false;
    return getIsHomepage();
  });

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
  const setSlugFromTitle = (language_id: number) => {
    if (getIsHomepage()) return;
    const item = getTranslations().find((t) => {
      return t.language_id === language_id;
    });

    if (!item?.title) return;
    if (item.slug) return;
    const slugValue = slugify(item.title, { lower: true });
    setTranslationsValues("slug", language_id, slugValue);
  };
  const setTranslationsValues = (
    key: "title" | "slug" | "excerpt",
    language_id: number,
    value: string | null
  ) => {
    const translations = getTranslations();
    const translation = translations.find((t) => {
      return t.language_id === language_id;
    });
    if (!translation) {
      const item: PagesResT["translations"][0] = {
        title: null,
        slug: null,
        excerpt: null,
        language_id,
      };
      item[key] = value;
      translations.push(item);
      setTranslations([...translations]);
      return;
    }
    translation[key] = value;
    setTranslations([...translations]);
  };
  const inputError = (index: number) => {
    const errors = mutateErrors()?.errors?.body?.translations.children;
    if (errors) return errors[index];
    return undefined;
  };
  const setDefualtTranslations = (translations: PagesResT["translations"]) => {
    const translationsValues = JSON.parse(
      JSON.stringify(translations)
    ) as PagesResT["translations"];

    const languagesValues = languages();
    for (let i = 0; i < languagesValues.length; i++) {
      const language = languagesValues[i];
      const translation = translationsValues.find((t) => {
        return t.language_id === language.id;
      });
      if (!translation) {
        const item: PagesResT["translations"][0] = {
          title: null,
          slug: null,
          excerpt: null,
          language_id: language.id,
        };
        translationsValues.push(item);
      }
    }

    setTranslations(
      translationsValues.map((translation) => {
        if (translation.slug && translation.slug !== "/") {
          translation.slug = translation.slug.replace(/^\//, "");
        }
        return translation;
      })
    );
  };
  const parseTranslationBody = (translations?: PagesResT["translations"]) => {
    if (!translations) return undefined;
    const homepage = getIsHomepage();
    return translations.map((translation) => {
      return {
        title: translation.title,
        slug: homepage ? null : translation.slug,
        excerpt: translation.excerpt,
        language_id: translation.language_id,
      };
    });
  };

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (page.isSuccess && categories.isSuccess) {
      setParentId(page.data?.data.parent_id || undefined);
      setIsHomepage(page.data?.data.homepage || false);
      setDefualtTranslations(page.data?.data.translations || []);
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
    setDefualtTranslations([]);
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
              translations: parseTranslationBody(body.translations),
            },
            headers: {
              "lucid-environment": environment() || "",
            },
          });
        } else {
          createPage.action.mutate({
            body: {
              translations: parseTranslationBody(getTranslations()) || [],
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
        <>
          <For each={languages()}>
            {(language, index) => (
              <Show when={language.id === lang?.contentLanguage()}>
                <SectionHeading
                  title={T("details_lang", {
                    code: `${language.code}`,
                  })}
                />
                <Form.Input
                  id="name"
                  value={
                    getTranslations().find((t) => {
                      return t.language_id === language.id;
                    })?.title || ""
                  }
                  onChange={(value) =>
                    setTranslationsValues("title", language.id, value)
                  }
                  name={"title"}
                  type="text"
                  copy={{
                    label: T("title"),
                  }}
                  onBlur={() => setSlugFromTitle(language.id)}
                  errors={inputError(index())?.title}
                  required={language.is_default}
                />
                <Show when={!hideSlugInput()}>
                  <Form.Input
                    id="slug"
                    value={
                      getTranslations().find((t) => {
                        return t.language_id === language.id;
                      })?.slug || ""
                    }
                    onChange={(value) =>
                      setTranslationsValues("slug", language.id, value)
                    }
                    name={"slug"}
                    type="text"
                    copy={{
                      label: T("slug"),
                      info: T("page_slug_description"),
                    }}
                    errors={inputError(index())?.slug}
                    required={language.is_default}
                  />
                </Show>
                <Form.Textarea
                  id="excerpt"
                  value={
                    getTranslations().find((t) => {
                      return t.language_id === language.id;
                    })?.excerpt || ""
                  }
                  onChange={(value) =>
                    setTranslationsValues("excerpt", language.id, value)
                  }
                  name={"excerpt"}
                  copy={{
                    label: T("excerpt"),
                  }}
                  errors={inputError(index())?.excerpt}
                />
              </Show>
            )}
          </For>
          <SectionHeading title={T("meta")} />
          <Show when={props.collection.disableHomepage !== true}>
            <Form.Checkbox
              id="homepage"
              value={getIsHomepage()}
              onChange={(value) => {
                setIsHomepage(value);
                if (panelMode() === "create") return;
                const translations = getTranslations();
                for (let i = 0; i < translations.length; i++) {
                  translations[i].slug = null;
                }
                setTranslations([...translations]);
              }}
              name={"homepage"}
              copy={{
                label: T("is_homepage"),
                describedBy: T("is_homepage_description"),
              }}
              errors={mutateErrors()?.errors?.body?.homepage}
            />
          </Show>
          <Show when={!hideSetParentPage()}>
            <Switch>
              <Match when={panelMode() === "create"}>
                <PageSearchSelect
                  id="parent_id"
                  name="parent_id"
                  collectionKey={props.collection.key}
                  value={getParentId()}
                  setValue={setParentId}
                  copy={{
                    label: T("parent_page"),
                  }}
                  errors={mutateErrors()?.errors?.body?.parent_id}
                />
              </Match>
              <Match when={panelMode() === "update"}>
                <ValidParentPageSearchSelect
                  pageId={props.id?.() as number}
                  id="parent_id"
                  name="parent_id"
                  collectionKey={props.collection.key}
                  value={getParentId()}
                  setValue={setParentId}
                  copy={{
                    label: T("parent_page"),
                  }}
                  errors={mutateErrors()?.errors?.body?.parent_id}
                />
              </Match>
            </Switch>
          </Show>
          <Form.SelectMultiple
            id="category_ids"
            values={getSelectedCategories()}
            onChange={setSelectedCategories}
            name={"category_ids"}
            copy={{
              label: T("categories"),
            }}
            options={
              categories.data?.data.map((cat) => {
                return {
                  value: cat.id,
                  label: cat.title,
                };
              }) || []
            }
            errors={mutateErrors()?.errors?.body?.category_ids}
          />
          <Show when={panelMode() === "update"}>
            <UserSearchSelect
              id="author_id"
              name="author_id"
              value={getSelectedAuthor()}
              setValue={setSelectedAuthor}
              copy={{
                label: T("author"),
              }}
              errors={mutateErrors()?.errors?.body?.author_id}
            />
          </Show>
        </>
      )}
    </Panel.Root>
  );
};

export default CreateUpdatePagePanel;
