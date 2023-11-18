import T from "@/translations";
import {
  Component,
  createMemo,
  Show,
  Accessor,
  Setter,
  Switch,
  Match,
  For,
} from "solid-js";
import slugify from "slugify";
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
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import PageSearchSelect from "@/components/Partials/SearchSelects/PageSearchSelect";
import ValidParentPageSearchSelect from "@/components/Partials/SearchSelects/ValidParentPageSearchSelect";
import UserSearchSelect from "@/components/Partials/SearchSelects/UserSearchSelect";

interface PageFieldGroupProps {
  mode: "create" | "update";
  theme?: "basic";
  showTitles: boolean;
  state: {
    pageId?: Accessor<number | undefined>;
    contentLanguage?: Accessor<number | undefined>;
    mutateErrors: Accessor<APIErrorResponse | undefined>;
    collection: CollectionResT;
    categories: CollectionCategoriesResT[];
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

const PageFieldGroup: Component<PageFieldGroupProps> = (props) => {
  // ------------------------------
  // Memos
  const languages = createMemo(() => contentLanguageStore.get.languages);
  const hideSlugInput = createMemo(() => {
    if (props.mode === "create") return false;
    return props.state.getIsHomepage();
  });
  const hideSetParentPage = createMemo(() => {
    return (
      props.state.collection.disableHomepage === true ||
      props.state.getIsHomepage()
    );
  });

  // ------------------------------
  // Functions
  const inputError = (index: number) => {
    const errors =
      props.state.mutateErrors()?.errors?.body?.translations.children;
    if (errors) return errors[index];
    return undefined;
  };
  const setSlugFromTitle = (language_id: number) => {
    if (props.state.getIsHomepage()) return;
    const item = props.state.getTranslations().find((t) => {
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
    const translations = props.state.getTranslations();
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
      props.setState.setTranslations([...translations]);
      return;
    }
    translation[key] = value;
    props.setState.setTranslations([...translations]);
  };

  // ------------------------------
  // Render
  return (
    <>
      <For each={languages()}>
        {(language, index) => (
          <Show
            when={
              language.id ===
              (props.state.contentLanguage !== undefined
                ? props.state.contentLanguage()
                : undefined)
            }
          >
            <Show when={props.showTitles}>
              <SectionHeading
                title={T("details_lang", {
                  code: `${language.code}`,
                })}
              />
            </Show>
            <Form.Input
              id="name"
              value={
                props.state.getTranslations().find((t) => {
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
              theme={props.theme}
            />
            <Show when={!hideSlugInput()}>
              <Form.Input
                id="slug"
                value={
                  props.state.getTranslations().find((t) => {
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
                  tooltip: T("page_slug_description"),
                }}
                errors={inputError(index())?.slug}
                required={language.is_default}
                theme={props.theme}
              />
            </Show>
            <Form.Textarea
              id="excerpt"
              value={
                props.state.getTranslations().find((t) => {
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
              theme={props.theme}
            />
          </Show>
        )}
      </For>
      <Show when={props.showTitles}>
        <SectionHeading title={T("meta")} />
      </Show>
      <Show when={props.state.collection.disableHomepage !== true}>
        <Form.Checkbox
          id="homepage"
          value={props.state.getIsHomepage()}
          onChange={(value) => {
            props.setState.setIsHomepage(value);
            if (props.mode === "create") return;
            const translations = props.state.getTranslations();
            for (let i = 0; i < translations.length; i++) {
              translations[i].slug = null;
            }
            props.setState.setTranslations([...translations]);
          }}
          name={"homepage"}
          copy={{
            label: T("is_homepage"),
            tooltip: T("is_homepage_description"),
          }}
          errors={props.state.mutateErrors()?.errors?.body?.homepage}
          theme={props.theme}
        />
      </Show>
      <Show when={!hideSetParentPage()}>
        <Switch>
          <Match when={props.mode === "create"}>
            <PageSearchSelect
              id="parent_id"
              name="parent_id"
              collectionKey={props.state.collection.key}
              value={props.state.getParentId()}
              setValue={props.setState.setParentId}
              copy={{
                label: T("parent_page"),
              }}
              errors={props.state.mutateErrors()?.errors?.body?.parent_id}
              theme={props.theme}
            />
          </Match>
          <Match when={props.mode === "update"}>
            <ValidParentPageSearchSelect
              pageId={props.state.pageId?.() as number}
              id="parent_id"
              name="parent_id"
              collectionKey={props.state.collection.key}
              value={props.state.getParentId()}
              setValue={props.setState.setParentId}
              copy={{
                label: T("parent_page"),
              }}
              errors={props.state.mutateErrors()?.errors?.body?.parent_id}
              theme={props.theme}
            />
          </Match>
        </Switch>
      </Show>
      <Form.SelectMultiple
        id="category_ids"
        values={props.state.getSelectedCategories()}
        onChange={props.setState.setSelectedCategories}
        name={"category_ids"}
        copy={{
          label: T("categories"),
        }}
        options={
          props.state.categories.map((cat) => {
            return {
              value: cat.id,
              label: cat.title,
            };
          }) || []
        }
        errors={props.state.mutateErrors()?.errors?.body?.category_ids}
        theme={props.theme}
      />
      <Show when={props.mode === "update"}>
        <UserSearchSelect
          id="author_id"
          name="author_id"
          value={props.state.getSelectedAuthor()}
          setValue={props.setState.setSelectedAuthor}
          copy={{
            label: T("author"),
          }}
          errors={props.state.mutateErrors()?.errors?.body?.author_id}
          theme={props.theme}
        />
      </Show>
    </>
  );
};

export default PageFieldGroup;
