import T from "@/translations";
import {
  Component,
  createMemo,
  createSignal,
  Show,
  createEffect,
  Accessor,
} from "solid-js";
import slugify from "slugify";
// Services
import api from "@/services/api";
// Utils
import helpers from "@/utils/helpers";
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
  const [getTitle, setTitle] = createSignal<string>("");
  const [getSlug, setSlug] = createSignal<string>("");
  const [getExcerpt, setExcerpt] = createSignal<string>("");
  const [getParentId, setParentId] = createSignal<number | undefined>(
    undefined
  );
  const [getIsHomepage, setIsHomepage] = createSignal<boolean>(false);
  const [getSelectedCategories, setSelectedCategories] = createSignal<
    SelectMultipleValueT[]
  >([]);

  // ---------------------------------
  // Mode
  const panelMode = createMemo(() => {
    if (props.id === undefined) return "create";
    return "update";
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
  const hideSetParentPage = createMemo(() => {
    return props.collection.disableHomepage === true || getIsHomepage();
  });

  const hideSlugInput = createMemo(() => {
    if (panelMode() === "create") return false;
    return getIsHomepage();
  });

  const updateData = createMemo(() => {
    return helpers.updateData(
      {
        title: page.data?.data.title,
        slug: page.data?.data.slug,
        homepage: page.data?.data.homepage,
        parent_id: page.data?.data.parent_id || null,
        category_ids: page.data?.data.categories || [],
        excerpt: page.data?.data.excerpt || "",
      },
      {
        title: getTitle(),
        slug: getSlug(),
        homepage: getIsHomepage(),
        parent_id: getParentId() || null,
        category_ids: getSelectedCategories().map(
          (cat) => cat.value
        ) as number[],
        excerpt: getExcerpt(),
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

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (page.isSuccess && categories.isSuccess) {
      setTitle(page.data?.data.title || "");
      setSlug(page.data?.data.slug || "");
      setParentId(page.data?.data.parent_id || undefined);
      setIsHomepage(page.data?.data.homepage || false);
      setExcerpt(page.data?.data.excerpt || "");
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
    }
  });

  createEffect(() => {
    if (getIsHomepage()) {
      setParentId(undefined);
    }
  });

  createEffect(() => {
    if (panelMode() === "update" && getIsHomepage()) {
      setSlug(page.data?.data.slug || "");
    }
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
        if (panelMode() === "update") {
          updatePage.action.mutate({
            id: props.id?.() as number,
            body: updateData().data,
            headers: {
              "lucid-environment": environment() || "",
            },
          });
        } else {
          createPage.action.mutate({
            body: {
              title: getTitle(),
              slug: getSlug(),
              collection_key: props.collection.key,
              homepage: getIsHomepage(),
              parent_id: getParentId(),
              excerpt: getExcerpt(),
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
        setTitle("");
        setSlug("");
        setExcerpt("");
        setParentId(undefined);
        setIsHomepage(false);
        setSelectedCategories([]);
      }}
      mutateState={{
        isLoading: mutateIsLoading(),
        errors: mutateErrors(),
      }}
      fetchState={{
        isLoading: fetchIsLoading(),
        isError: fetchIsError(),
      }}
      content={panelContent()}
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
        errors={mutateErrors()?.errors?.body?.title}
      />
      <Show when={!hideSlugInput()}>
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
      </Show>
      <Form.Textarea
        id="excerpt"
        value={getExcerpt() || ""}
        onChange={setExcerpt}
        name={"excerpt"}
        copy={{
          label: T("excerpt"),
        }}
        errors={mutateErrors()?.errors?.body?.excerpt}
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
          errors={mutateErrors()?.errors?.body?.homepage}
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
          errors={mutateErrors()?.errors?.body?.parent_id}
        />
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
    </Panel.Root>
  );
};

export default CreateUpdatePagePanel;
