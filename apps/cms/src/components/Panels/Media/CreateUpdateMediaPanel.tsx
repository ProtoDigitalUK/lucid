import T from "@/translations";
import {
  Component,
  createMemo,
  createSignal,
  Show,
  For,
  createEffect,
  Accessor,
} from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
// Utils
import helpers from "@/utils/helpers";
import dateHelpers from "@/utils/date-helpers";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import DetailsList from "@/components/Partials/DetailsList";

interface CreateUpdateMediaPanelProps {
  id?: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

interface MediaTranslations {
  language_id: number;
  alt: string | null;
  name: string | null;
}

const CreateUpdateMediaPanel: Component<CreateUpdateMediaPanelProps> = (
  props
) => {
  const panelMode = createMemo(() => {
    return props.id === undefined ? "create" : "update";
  });

  // ---------------------------------
  // Queries
  const media = api.media.useGetSingle({
    queryParams: {
      location: {
        id: props.id as Accessor<number | undefined>,
      },
    },
    enabled: () => props.id !== undefined && !!props.id(),
  });

  // ------------------------------
  // State
  const [getUpdateDataLock, setUpdateDataLock] = createSignal(false);
  const [getUpdateFileLock, setUpdateFileLock] = createSignal(false);
  const [getTranslations, setTranslations] = createSignal<
    Array<MediaTranslations>
  >([]);
  const [getMediaId, setMediaId] = createSignal<number | null>(null);

  // ---------------------------------
  // Mutations
  const uploadSingleFile = api.media.useUploadFileSingle();
  const updateSingleFile = api.media.useUpdateFileSingle();
  const updateSingle = api.media.useUpdateSingle();

  const MediaFile = useSingleFileUpload({
    id: "file",
    disableRemoveCurrent: true,
    name: "file",
    required: true,
    errors:
      panelMode() === "create"
        ? uploadSingleFile.errors
        : updateSingleFile.errors,
    noMargin: false,
  });

  // ---------------------------------
  // Memos
  const showAltInput = createMemo(() => {
    if (MediaFile.getFile() !== null) {
      const type = helpers.getMediaType(MediaFile.getFile()?.type);
      return type === "image";
    }
    return panelMode() === "create" ? false : media.data?.data.type === "image";
  });
  const languages = createMemo(() => contentLanguageStore.get.languages);
  const mutateIsLoading = createMemo(() => {
    return (
      uploadSingleFile.action.isLoading ||
      updateSingle.action.isLoading ||
      updateSingleFile.action.isLoading
    );
  });
  const mutateErrors = createMemo(() => {
    return (
      uploadSingleFile.errors() ||
      updateSingle.errors() ||
      updateSingleFile.errors()
    );
  });
  const hasTranslationErrors = createMemo(() => {
    const errors = updateSingle.errors()?.errors?.body?.translations.children;
    if (errors) {
      return errors.length > 0;
    }
    return false;
  });
  const updateData = createMemo(() => {
    const { changed, data } = helpers.updateData(
      {
        translations: media.data?.data.translations || [],
      },
      {
        translations: getTranslations(),
      }
    );

    let resData: {
      translations?: Array<MediaTranslations>;
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
  const mutateIsDisabled = createMemo(() => {
    if (panelMode() === "create") {
      return MediaFile.getFile() === null;
    } else {
      return !updateData().changed;
    }
  });
  const panelContent = createMemo(() => {
    if (panelMode() === "create") {
      return {
        title: T("create_media_panel_title"),
        description: T("create_media_panel_description"),
        submit: T("create"),
      };
    } else {
      return {
        title: T("update_media_panel_title"),
        description: T("update_media_panel_description"),
        submit: T("update"),
      };
    }
  });
  const panelFetchState = createMemo(() => {
    if (panelMode() === "create") {
      return undefined;
    } else {
      return {
        isLoading: media.isLoading,
        isError: media.isError,
      };
    }
  });

  // ---------------------------------
  // Functions
  const setTranslationsValues = (
    key: "name" | "alt",
    value: string,
    language_id: number
  ) => {
    const translations = getTranslations();
    const translation = translations.find((t) => {
      return t.language_id === language_id;
    });
    if (!translation) {
      const item: MediaTranslations = {
        language_id,
        alt: null,
        name: null,
      };
      item[key] = value;
      translations.push(item);
      setTranslations([...translations]);
      return;
    }
    translation[key] = value;
    setTranslations([...translations]);
  };
  const panelSubmitCreate = async () => {
    const file = MediaFile.getFile();
    if (file === null) return;

    if (getMediaId() === null) {
      const response = await Promise.allSettled([
        uploadSingleFile.action.mutateAsync({
          body: {
            file: file,
          },
        }),
      ]);
      if (response[0].status === "fulfilled") {
        setMediaId(response[0].value.data.id);
        updateTranslations(response[0].value.data.id);
      }
    } else {
      updateTranslations(getMediaId()!);
    }
  };
  const panelSubmitUpdate = async () => {
    const id = props.id && props.id();
    if (id === undefined) return;

    const resultes = await Promise.allSettled([
      updateSingle.action.mutateAsync({
        id: id,
        body: {
          translations: updateData().data.translations || [],
        },
      }),
      MediaFile.getFile() !== null
        ? updateSingleFile.action.mutateAsync({
            id: id,
            body: {
              file: MediaFile.getFile() as File,
            },
          })
        : Promise.resolve(),
    ]);

    if (resultes[0].status === "rejected" || resultes[1].status === "rejected")
      return;

    props.state.setOpen(false);
  };
  const updateTranslations = async (id: number) => {
    const response = await Promise.allSettled([
      updateSingle.action.mutateAsync({
        id: id,
        body: {
          translations: getTranslations(),
        },
      }),
    ]);
    if (response[0].status === "fulfilled") {
      props.state.setOpen(false);
    }
  };
  const setDefualtTranslations = (translations: MediaTranslations[]) => {
    const translationsValues = JSON.parse(
      JSON.stringify(translations)
    ) as MediaTranslations[];

    const languagesValues = languages();
    for (let i = 0; i < languagesValues.length; i++) {
      const language = languagesValues[i];
      const translation = translationsValues.find((t) => {
        return t.language_id === language.id;
      });
      if (!translation) {
        const item: MediaTranslations = {
          language_id: language.id,
          alt: null,
          name: null,
        };
        translationsValues.push(item);
      }
    }

    setTranslations(translationsValues);
  };

  const inputError = (index: number) => {
    const errors = mutateErrors()?.errors?.body?.translations.children;
    if (errors) return errors[index];
    return undefined;
  };

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (panelMode() === "update") return;
    if (getTranslations().length > 0) return;
    setDefualtTranslations([]);
  });

  createEffect(() => {
    if (media.isSuccess && panelMode() === "update") {
      if (!getUpdateDataLock()) {
        setDefualtTranslations(media.data?.data.translations || []);
        setUpdateDataLock(true);
      }
      if (!getUpdateFileLock()) {
        MediaFile.reset();
        MediaFile.setCurrentFile({
          name: media.data.data.key,
          url: media.data?.data.url
            ? `${media.data.data.url}?width=400`
            : undefined,
          type: media.data?.data.type || undefined,
        });
        setUpdateFileLock(true);
      }
    }
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        if (panelMode() === "create") {
          panelSubmitCreate();
        } else {
          panelSubmitUpdate();
        }
      }}
      fetchState={panelFetchState()}
      reset={() => {
        uploadSingleFile.reset();
        updateSingle.reset();
        MediaFile.reset();
        setMediaId(null);
        setTranslations([]);
        setUpdateDataLock(false);
        setUpdateFileLock(false);
      }}
      mutateState={{
        isLoading: mutateIsLoading(),
        errors: mutateErrors(),
        isDisabled: mutateIsDisabled(),
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
          <MediaFile.Render />
          <For each={languages()}>
            {(language, index) => (
              <Show when={language.id === lang?.contentLanguage()}>
                <SectionHeading
                  title={T("details_lang", {
                    code: language.code,
                  })}
                />
                <Form.Input
                  id={`name-${language.id}`}
                  value={
                    getTranslations().find(
                      (item) => item.language_id === language.id
                    )?.name || ""
                  }
                  onChange={(val) => {
                    setTranslationsValues("name", val, language.id);
                  }}
                  name={`name-${language.id}`}
                  type="text"
                  copy={{
                    label: T("name"),
                  }}
                  errors={inputError(index())?.name}
                />
                <Show when={showAltInput()}>
                  <Form.Input
                    id={`alt-${language.id}`}
                    value={
                      getTranslations().find(
                        (item) => item.language_id === language.id
                      )?.alt || ""
                    }
                    onChange={(val) => {
                      setTranslationsValues("alt", val, language.id);
                    }}
                    name={`alt-${language.id}`}
                    type="text"
                    copy={{
                      label: T("alt"),
                    }}
                    errors={inputError(index())?.alt}
                  />
                </Show>
              </Show>
            )}
          </For>
          <Show when={props.id !== undefined}>
            <SectionHeading title={T("meta")} />
            <DetailsList
              type="text"
              items={[
                {
                  label: T("file_size"),
                  value: helpers.bytesToSize(
                    media.data?.data.meta.file_size || 0
                  ),
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
          </Show>
        </>
      )}
    </Panel.Root>
  );
};

export default CreateUpdateMediaPanel;
