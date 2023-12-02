import { Component, For, createMemo } from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
import useSearchParams from "@/hooks/useSearchParams";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
// Components
import Grid from "@/components/Groups/Grid";
import MediaCard, { MediaCardLoading } from "@/components/Cards/MediaCard";
import CreateUpdateMediaPanel from "@/components/Panels/Media/CreateUpdateMediaPanel";
import DeleteMedia from "@/components/Modals/Media/DeleteMedia";
import ClearProcessedMedia from "@/components/Modals/Media/ClearProcessedImages";

interface MediaGridProps {
  searchParams: ReturnType<typeof useSearchParams>;
}

const MediaGrid: Component<MediaGridProps> = (props) => {
  // ----------------------------------
  // Hooks
  const rowTarget = useRowTarget({
    triggers: {
      update: false,
      delete: false,
      clear: false,
    },
  });

  // ----------------------------------
  // Memos
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );

  // ----------------------------------
  // Queries
  const media = api.media.useGetMultiple({
    queryParams: {
      queryString: props.searchParams.getQueryString,
      headers: {
        "headless-content-lang": contentLanguage,
      },
    },
    enabled: () => props.searchParams.getSettled(),
  });

  // ----------------------------------
  // Render
  return (
    <>
      <Grid.Root
        items={media.data?.data.length || 0}
        state={{
          isLoading: media.isLoading,
          isError: media.isError,
          isSuccess: media.isSuccess,
        }}
        searchParams={props.searchParams}
        meta={media.data?.meta}
        loadingCard={<MediaCardLoading />}
      >
        <For each={media.data?.data}>
          {(item) => (
            <MediaCard
              media={item}
              rowTarget={rowTarget}
              contentLanguage={contentLanguage()}
            />
          )}
        </For>
      </Grid.Root>

      <CreateUpdateMediaPanel
        id={rowTarget.getTargetId}
        state={{
          open: rowTarget.getTriggers().update,
          setOpen: (state: boolean) => {
            rowTarget.setTrigger("update", state);
          },
        }}
      />
      <DeleteMedia
        id={rowTarget.getTargetId}
        state={{
          open: rowTarget.getTriggers().delete,
          setOpen: (state: boolean) => {
            rowTarget.setTrigger("delete", state);
          },
        }}
      />
      <ClearProcessedMedia
        id={rowTarget.getTargetId}
        state={{
          open: rowTarget.getTriggers().clear,
          setOpen: (state: boolean) => {
            rowTarget.setTrigger("clear", state);
          },
        }}
      />
    </>
  );
};

export default MediaGrid;
