import T from "@/translations";
import { Component, createMemo, For, onCleanup } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Store
import mediaSelectStore from "@/store/mediaSelectStore";
import contentLanguageStore from "@/store/contentLanguageStore";
// Services
import api from "@/services/api";
// Components
import Query from "@/components/Groups/Query";
import Modal from "@/components/Groups/Modal";
import Grid from "@/components/Groups/Grid";
import MediaBasicCard, {
  MediaBasicCardLoading,
} from "@/components/Cards/MediaBasicCard";

interface SelectMediaProps {}

const SelectMedia: Component<SelectMediaProps> = () => {
  // ------------------------------
  // Memos
  const open = createMemo(() => mediaSelectStore.get.open);

  // ------------------------------
  // Render
  return (
    <Modal.Root
      state={{
        open: open(),
        setOpen: () => mediaSelectStore.set("open", false),
      }}
      options={{
        noPadding: true,
        size: "large",
      }}
    >
      <SelectMediaContent />
    </Modal.Root>
  );
};

const SelectMediaContent: Component = () => {
  // ------------------------------
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useSearchParams(
    {
      filters: {
        name: {
          value: "",
          type: "text",
        },
        file_extension: {
          value: "",
          type: "text",
        },
        type: {
          value: "",
          type: "array",
        },
      },
      sorts: {
        file_size: undefined,
        name: undefined,
        width: undefined,
        height: undefined,
        created_at: undefined,
        updated_at: "desc",
      },
      pagination: {
        per_page: 20,
      },
    },
    {
      singleSort: true,
    }
  );

  // ----------------------------------
  // Memos
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );

  // ----------------------------------
  // Queries
  const media = api.media.useGetMultiple({
    queryParams: {
      queryString: searchParams.getQueryString,
      headers: {
        "headless-content-lang": contentLanguage,
      },
    },
    enabled: () => searchParams.getSettled(),
  });

  // ----------------------------------
  // Mount
  onCleanup(() => {
    navigate(location.pathname);
  });

  // ----------------------------------
  // Render
  return (
    <div class="p-15">
      <div class="mb-15">
        <h2>{T("select_media")}</h2>
        <p>{T("select_media_description")}</p>
      </div>
      <div class="w-full flex justify-between mb-15 pb-15 border-b border-border">
        <div class="flex gap-5">
          <Query.Filter
            filters={[
              {
                label: T("name"),
                key: "name",
                type: "text",
              },
              {
                label: T("type"),
                key: "type",
                type: "multi-select",
                options: [
                  {
                    label: T("image"),
                    value: "image",
                  },
                  {
                    label: T("video"),
                    value: "video",
                  },
                  {
                    label: T("audio"),
                    value: "audio",
                  },
                  {
                    label: T("document"),
                    value: "document",
                  },
                  {
                    label: T("archive"),
                    value: "archive",
                  },
                  {
                    label: T("unknown"),
                    value: "unknown",
                  },
                ],
              },
              {
                label: T("file_extension"),
                key: "file_extension",
                type: "text",
              },
            ]}
            searchParams={searchParams}
          />
          <Query.Sort
            sorts={[
              {
                label: T("name"),
                key: "name",
              },
              {
                label: T("file_size"),
                key: "file_size",
              },
              {
                label: T("width"),
                key: "width",
              },
              {
                label: T("height"),
                key: "height",
              },
              {
                label: T("created_at"),
                key: "created_at",
              },
              {
                label: T("updated_at"),
                key: "updated_at",
              },
            ]}
            searchParams={searchParams}
          />
        </div>
        <div>
          <Query.PerPage options={[10, 20, 40]} searchParams={searchParams} />
        </div>
      </div>
      <div class="relative w-full min-h-[600px] flex flex-col justify-between">
        <Grid.Modal
          items={media.data?.data.length || 0}
          state={{
            isLoading: media.isLoading,
            isError: media.isError,
            isSuccess: media.isSuccess,
          }}
          searchParams={searchParams}
          meta={media.data?.meta}
          loadingCard={<MediaBasicCardLoading />}
        >
          <For each={media.data?.data}>
            {(item) => (
              <MediaBasicCard
                media={item}
                contentLanguage={contentLanguage()}
                onClick={() => {
                  mediaSelectStore.get.onSelectCallback(item);
                  mediaSelectStore.set("open", false);
                }}
              />
            )}
          </For>
        </Grid.Modal>
      </div>
    </div>
  );
};

export default SelectMedia;
