import T from "@/translations";
import { Component, createMemo, createSignal, Show } from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
// Utils
import helpers from "@/utils/helpers";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";

interface CreateMediaPanelProps {
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const CreateMediaPanel: Component<CreateMediaPanelProps> = (props) => {
  // ------------------------------
  // State
  const [getAlt, setAlt] = createSignal<
    Array<{
      language_id: number;
      value: string;
      key: "alt";
    }>
  >([]);
  const [getName, setName] = createSignal<
    Array<{
      language_id: number;
      value: string;
      key: "name";
    }>
  >([]);

  // ---------------------------------
  // Mutations
  const createMedia = api.media.useCreateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  const MediaFile = useSingleFileUpload({
    id: "file",
    disableRemoveCurrent: true,
    name: "file",
    required: true,
    errors: createMedia.errors,
    noMargin: false,
  });

  // ---------------------------------
  // Memos
  const showAltInput = createMemo(() => {
    if (MediaFile.getFile() !== null) {
      const type = helpers.getMediaType(MediaFile.getFile()?.type);
      return type === "image";
    }
    return false;
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        createMedia.action.mutate({
          body: {
            translations: [],
            file: MediaFile.getFile() || undefined,
          },
        });
      }}
      reset={() => {
        createMedia.reset();
        MediaFile.reset();
        setName([]);
        setAlt([]);
      }}
      mutateState={{
        isLoading: createMedia.action.isLoading,
        errors: createMedia.errors(),
      }}
      content={{
        title: T("create_media_panel_title"),
        description: T("create_media_panel_description"),
        submit: T("create"),
      }}
      contentLanguage={true}
    >
      {() => (
        <>
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
            errors={createMedia.errors()?.errors?.body?.name}
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
              errors={createMedia.errors()?.errors?.body?.alt}
            />
          </Show>
        </>
      )}
    </Panel.Root>
  );
};

export default CreateMediaPanel;
