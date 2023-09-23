import { Component, createSignal, createMemo, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
// Types
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";

const EnvCollectionsPagesEditRoute: Component = () => {
  // ------------------------------
  // Hooks
  const params = useParams();

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
  const [getSelectedAuthor, setSelectedAuthor] = createSignal<
    number | undefined
  >(undefined);

  // ----------------------------------
  // Memos
  const pageId = createMemo(() => Number(params.id));
  const collectionKey = createMemo(() => params.collectionKey);

  // ----------------------------------
  // Queries
  const categories = api.environment.collections.categories.useGetMultiple({
    queryParams: {
      filters: {
        collection_key: collectionKey,
      },
      headers: {
        "lucid-environment": environment,
      },
      perPage: -1,
    },
    enabled: () => !!collectionKey(),
  });
  const collection = api.environment.collections.useGetSingle({
    queryParams: {
      location: {
        collection_key: collectionKey,
      },
      headers: {
        "lucid-environment": environment,
      },
    },
    enabled: () => !!collectionKey(),
  });
  const page = api.environment.collections.pages.useGetSingle({
    queryParams: {
      location: {
        id: pageId(),
      },
      includes: {
        bricks: false,
      },
      headers: {
        "lucid-environment": environment,
      },
    },
    enabled: () => !!pageId(),
  });
  // const brickConfig = api.brickConfig.useGetAll({
  //   queryParams: {
  //     include: {
  //       fields: false,
  //     },
  //     filters: {
  //       collection_key: collectionKey,
  //       environment_key: environment,
  //     },
  //   },
  // });

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
      setSelectedAuthor(page.data?.data.author?.id || undefined);
    }
  });

  // ----------------------------------
  // Render
  return (
    <div class="relative h-screen w-full flex">
      {/* Inputs */}
      <div class="w-[500px] max-h-screen overflow-y-auto p-15 md:p-30">
        <PageBuilder.Sidebar
          data={{
            pageId: pageId(),
            collection: collection.data?.data,
            categories: categories.data?.data || [],
          }}
          state={{
            getTitle,
            setTitle,
            getSlug,
            setSlug,
            getExcerpt,
            setExcerpt,
            getParentId,
            setParentId,
            getIsHomepage,
            setIsHomepage,
            getSelectedCategories,
            setSelectedCategories,
            getSelectedAuthor,
            setSelectedAuthor,
          }}
        />
      </div>
      {/* Build */}
      <div class="h-full w-full p-15 pl-0">
        <div class="w-full h-full bg-primary rounded-md brick-pattern relative">
          <div class="absolute inset-0 overflow-y-scroll z-10 right-[165px] flex flex-col justify-center items-center p-15">
            <PageBuilder.Builder />
          </div>
          <div class="absolute top-15 right-15 bottom-15 w-[150px] p-15 bg-white bg-opacity-20 rounded-md z-20">
            <PageBuilder.PreviewBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvCollectionsPagesEditRoute;
