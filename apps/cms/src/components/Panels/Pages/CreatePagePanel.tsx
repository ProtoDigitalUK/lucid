import T from "@/translations";
import { Component, createMemo, createSignal, Show } from "solid-js";
import slugify from "slugify";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
// Types
import type { CollectionResT } from "@lucid/types/src/collections";
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import PageSearchSelect from "@/components/Partials/SearchSelects/PageSearchSelect";

interface CreatePagePanelProps {
  collection: CollectionResT;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const CreatePagePanel: Component<CreatePagePanelProps> = (props) => {
  // ------------------------------
  // State
  const [getTitle, setTitle] = createSignal<string>("");
  const [getSlug, setSlug] = createSignal<string>("");
  const [getParentId, setParentId] = createSignal<number | undefined>(
    undefined
  );
  const [getIsHomepage, setIsHomepage] = createSignal<boolean>(false);
  const [getSelectedCategories, setSelectedCategories] = createSignal<
    SelectMultipleValueT[]
  >([]);

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

  // ---------------------------------
  // Mutations
  const createPage = api.environment.collections.pages.useCreateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  // ---------------------------------
  // Memos
  const hideSetParentPage = createMemo(() => {
    return props.collection.disableHomepage === true || getIsHomepage();
  });

  // ---------------------------------
  // Functions
  const setSlugFromTitle = () => {
    if (!getTitle()) return;
    if (getSlug()) return;
    setSlug(slugify(getTitle(), { lower: true }));
  };

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        createPage.action.mutate({
          body: {
            title: getTitle(),
            slug: getSlug(),
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
      }}
      reset={() => {
        createPage.reset();
        setTitle("");
        setSlug("");
        setParentId(undefined);
        setIsHomepage(false);
        setSelectedCategories([]);
      }}
      mutateState={{
        isLoading: createPage.action.isLoading,
        errors: createPage.errors(),
      }}
      fetchState={{
        isLoading: categories.isLoading,
        isError: categories.isError,
      }}
      content={{
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
      }}
    >
      <SectionHeading title={T("details")} />
      <Form.Input
        id="name"
        value={getTitle() || ""}
        onChange={setTitle}
        name={"title"}
        type="text"
        copy={{
          label: T("title"),
        }}
        onBlur={setSlugFromTitle}
        errors={createPage.errors()?.errors?.body?.title}
      />
      <Form.Input
        id="slug"
        value={getSlug() || ""}
        onChange={setSlug}
        name={"slug"}
        type="text"
        copy={{
          label: T("slug"),
          describedBy: T("page_slug_description"),
        }}
        errors={createPage.errors()?.errors?.body?.slug}
      />
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
        errors={createPage.errors()?.errors?.body?.category_ids}
      />
      <Show when={props.collection.disableHomepage !== true}>
        <Form.Checkbox
          id="homepage"
          value={getIsHomepage()}
          onChange={setIsHomepage}
          name={"homepage"}
          copy={{
            label: T("is_homepage"),
            describedBy: T("is_homepage_description"),
          }}
          errors={createPage.errors()?.errors?.body?.homepage}
        />
      </Show>
      <Show when={!hideSetParentPage()}>
        <PageSearchSelect
          id="parent_id"
          name="parent_id"
          collectionKey={props.collection.key}
          value={getParentId()}
          setValue={setParentId}
          copy={{
            label: T("parent_page"),
          }}
          errors={createPage.errors()?.errors?.body?.parent_id}
        />
      </Show>
    </Panel.Root>
  );
};

export default CreatePagePanel;
