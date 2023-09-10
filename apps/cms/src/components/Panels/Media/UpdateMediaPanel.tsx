import T from "@/translations";
import {
  Component,
  Accessor,
  createMemo,
  createSignal,
  createEffect,
  Show,
} from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
// Utils
import helpers from "@/utils/helpers";
import dateHelpers from "@/utils/date-helpers";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import DetailsList from "@/components/Partials/DetailsList";

interface UpdateMediaPanelProps {
  id: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const UpdateMediaPanel: Component<UpdateMediaPanelProps> = (props) => {
  // ---------------------------------
  // Queries
  const media = api.media.useGetSingle({
    queryParams: {
      location: {
        id: props.id,
      },
    },
    enabled: () => !!props.id(),
  });

  // ------------------------------
  // State
  const [getAlt, setAlt] = createSignal<string | undefined>(undefined);
  const [getName, setName] = createSignal<string | undefined>(undefined);

  // ---------------------------------
  // Mutations
  const updateMedia = api.media.useUpdateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  const MediaFile = useSingleFileUpload({
    id: "file",
    disableRemoveCurrent: true,
    name: "file",
    required: true,
    errors: updateMedia.errors,
    noMargin: false,
  });

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (media.isSuccess) {
      setName(media.data?.data.name || "");
      setAlt(media.data?.data.alt || "");
      MediaFile.reset();
      MediaFile.setCurrentFile({
        name: media.data?.data.name || undefined,
        url: media.data?.data.url
          ? `${media.data.data.url}?width=400`
          : undefined,
        type: media.data?.data.type || undefined,
      });
    }
  });

  // ---------------------------------
  // Memos
  const updateData = createMemo(() => {
    const { changed, data } = helpers.updateData(
      {
        name: media.data?.data.name || "",
        alt: media.data?.data.alt || "",
      },
      {
        name: getName(),
        alt: getAlt(),
      }
    );

    let resData: {
      name?: string;
      alt?: string;
      file?: File;
    } = data;
    let resChanged = changed;

    if (MediaFile.getFile()) {
      resChanged = true;

      resData = {
        ...data,
        file: MediaFile.getFile() || undefined,
      };
    }

    return {
      changed: resChanged,
      data: resData,
    };
  });

  const showAltInput = createMemo(() => {
    if (MediaFile.getFile() !== null) {
      const type = helpers.getMediaType(MediaFile.getFile()?.type);
      return type === "image";
    }
    return media.data?.data.type === "image";
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        updateMedia.action.mutate({
          id: props.id() as number,
          body: updateData().data,
        });
      }}
      reset={() => {
        updateMedia.reset();
      }}
      fetchState={{
        isLoading: media.isLoading,
        isError: media.isError,
      }}
      mutateState={{
        isLoading: updateMedia.action.isLoading,
        isDisabled: !updateData().changed,
        errors: updateMedia.errors(),
      }}
      content={{
        title: T("update_media_panel_title"),
        description: T("update_media_panel_description"),
        submit: T("update"),
      }}
    >
      <MediaFile.Render />
      <SectionHeading title={T("details")} />
      <Form.Input
        id="name"
        value={getName() || ""}
        onChange={setName}
        name={"name"}
        type="text"
        copy={{
          label: T("name"),
        }}
        errors={updateMedia.errors()?.errors?.body?.name}
      />
      <Show when={showAltInput()}>
        <Form.Input
          id="alt"
          value={getAlt() || ""}
          onChange={setAlt}
          name={"alt"}
          type="text"
          copy={{
            label: T("alt"),
          }}
          errors={updateMedia.errors()?.errors?.body?.alt}
        />
      </Show>
      <SectionHeading title={T("meta")} />
      <DetailsList
        items={[
          {
            label: T("file_size"),
            value: helpers.bytesToSize(media.data?.data.meta.file_size || 0),
          },
          {
            label: T("dimensions"),
            value: `${media.data?.data.meta.width} x ${media.data?.data.meta.height}`,
            show: media.data?.data.type === "image",
          },
          {
            label: T("extension"),
            value: media.data?.data.meta.file_extension,
          },
          {
            label: T("mime_type"),
            value: media.data?.data.meta.mime_type,
          },
          {
            label: T("created_at"),
            value: dateHelpers.formatDate(media.data?.data.created_at),
          },
          {
            label: T("updated_at"),
            value: dateHelpers.formatDate(media.data?.data.updated_at),
          },
        ]}
      />
    </Panel.Root>
  );
};

export default UpdateMediaPanel;
