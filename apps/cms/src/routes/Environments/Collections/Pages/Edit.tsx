import T from "@/translations/index";
import {
  Component,
  createSignal,
  createMemo,
  createEffect,
  Show,
  Switch,
  Match,
} from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import shortUUID from "short-uuid";
import { FaSolidRobot, FaSolidTrash } from "solid-icons/fa";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
import builderStore from "@/store/builderStore";
// Types
import type { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
import type { CollectionResT } from "@lucid/types/src/collections";
import type { PagesResT } from "@lucid/types/src/pages";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import AddBrick from "@/components/Modals/Bricks/AddBrick";
import Button from "@/components/Partials/Button";
import DeletePage from "@/components/Modals/Pages/DeletePage";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";

const EnvCollectionsPagesEditRoute: Component = () => {
  // ------------------------------
  // Hooks
  const params = useParams();
  const navigate = useNavigate();

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

  // Modals
  const [getSelectBrickOpen, setSelectBrickOpen] = createSignal(false);
  const [getDeleteOpen, setDeleteOpen] = createSignal(false);

  // ----------------------------------
  // Params
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
  const brickConfig = api.brickConfig.useGetAll({
    queryParams: {
      include: {
        fields: true,
      },
      filters: {
        collection_key: collectionKey,
        environment_key: environment,
      },
    },
  });

  // ----------------------------------
  // Memos
  const isLoading = createMemo(() => {
    return (
      categories.isLoading ||
      collection.isLoading ||
      page.isLoading ||
      brickConfig.isLoading
    );
  });
  const mutationErrors = createMemo(() => {
    return undefined;
  });

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (page.isSuccess && categories.isSuccess && collection.isSuccess) {
      builderStore.get.reset();

      setParentId(page.data?.data.parent_id || undefined);
      setIsHomepage(page.data?.data.homepage || false);
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

      // TODO: add better solution for this
      // Set fixed
      builderStore.set(
        "bricks",
        collection.data.data.bricks
          .filter((brick) => brick.type === "fixed")
          .map((brick, i) => {
            return {
              id: `temp-${shortUUID.generate()}}`,
              key: brick.key,
              fields: [],
              groups: [],
              type: "fixed",
              order: i,
              position: (brick.position === "top" ? "top" : "bottom") as
                | "top"
                | "bottom",
            };
          })
      );
    }
  });

  // ----------------------------------
  // Render
  return (
    <>
      <header class="h-[60px] w-full bg-container border-b border-border px-15 flex items-center justify-between">
        <h1 class="text-xl">
          {T("edit_page_route_title")}
          <span class="text-unfocused ml-2.5">#{page.data?.data.id}</span>
        </h1>
        <div class="flex items-center gap-2.5">
          <div class="min-w-[250px]">
            <ContentLanguageSelect />
          </div>
          <Button
            type="button"
            theme="primary"
            size="small"
            onClick={() => alert("save page")}
          >
            {T("save", {
              singular: collection.data?.data.singular || "",
            })}
          </Button>
          <Button
            theme="danger"
            size="icon"
            type="button"
            onClick={() => setDeleteOpen(true)}
          >
            <span class="sr-only">{T("delete")}</span>
            <FaSolidTrash />
          </Button>
        </div>
      </header>
      <div class="relative h-[calc(100vh-60px)] w-full flex">
        {/* Sidebar Bricks & page fields */}
        <div class="w-[500px] max-h-screen overflow-y-auto p-15">
          <Switch>
            <Match when={!isLoading()}>
              <PageBuilder.Sidebar
                state={{
                  pageId: pageId(),
                  collection: collection.data?.data as CollectionResT,
                  categories: categories.data?.data || [],
                  mutateErrors: mutationErrors,
                  // Page Details
                  getTranslations,
                  getParentId,
                  getIsHomepage,
                  getSelectedCategories,
                  getSelectedAuthor,
                }}
                setState={{
                  // Page Details
                  setTranslations,
                  setParentId,
                  setIsHomepage,
                  setSelectedCategories,
                  setSelectedAuthor,
                }}
              />
            </Match>
          </Switch>
        </div>
        {/* Build */}
        <div class="h-full w-full p-15 pl-0">
          <div class="h-[40px] w-full mb-15 flex items-center">
            <Button
              type="button"
              theme="primary"
              size="small"
              onClick={() => {
                setSelectBrickOpen(true);
              }}
            >
              {T("add_brick")}
            </Button>
            <button
              class="h-10 w-10 rounded-full ml-2.5 bg-secondary flex items-center justify-center fill-white text-xl hover:bg-secondaryH duration-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              disabled
            >
              <FaSolidRobot />
            </button>
          </div>
          <div class="w-full h-[calc(100%-55px)] bg-primary rounded-md brick-pattern relative">
            <div class="absolute inset-0 overflow-y-scroll z-10 right-[195px] p-15">
              <PageBuilder.Builder
                data={{
                  brickConfig: brickConfig.data?.data || [],
                }}
                state={{
                  setOpenSelectBrick: () => {
                    setSelectBrickOpen(true);
                  },
                }}
              />
            </div>
            <div class="absolute top-15 right-15 bottom-15 w-[180px] z-20 overflow-y-scroll">
              <PageBuilder.PreviewBar
                data={{
                  brickConfig: brickConfig.data?.data || [],
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Show when={!isLoading()}>
        {/* Modals */}
        <AddBrick
          state={{
            open: getSelectBrickOpen(),
            setOpen: setSelectBrickOpen,
          }}
          data={{
            collection: collection.data?.data,
            brickConfig: brickConfig.data?.data || [],
          }}
        />
        <DeletePage
          id={page.data?.data.id}
          state={{
            open: getDeleteOpen(),
            setOpen: setDeleteOpen,
          }}
          collection={collection.data?.data as CollectionResT}
          callbacks={{
            onSuccess: () => {
              navigate(
                `/env/${environment()}/collection/${collection.data?.data.key}`
              );
            },
          }}
        />
      </Show>
    </>
  );
};

export default EnvCollectionsPagesEditRoute;
