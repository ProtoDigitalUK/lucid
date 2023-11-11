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

interface CreateMediaPanelProps {
  id?: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

interface MediaTranslations {
  id?: number | undefined;
  language_id: number;
  value: string;
  key: "alt" | "name";
}

const CreateMediaPanel: Component<CreateMediaPanelProps> = (props) => {
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

  const [getAlt, setAlt] = createSignal<Array<MediaTranslations>>([]);
  const [getName, setName] = createSignal<Array<MediaTranslations>>([]);
  const [getOriginalAlt, setOriginalAlt] = createSignal<
    Array<MediaTranslations>
  >([]);
  const [getOriginalName, setOriginalName] = createSignal<
    Array<MediaTranslations>
  >([]);

  const translations = createMemo(() => [...getAlt(), ...getName()]);
  const originalTranslations = createMemo(() => [
    ...getOriginalAlt(),
    ...getOriginalName(),
  ]);

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
      props.id === undefined
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
    return props.id === undefined ? false : media.data?.data.type === "image";
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
        translations: originalTranslations(),
      },
      {
        translations: translations(),
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
    if (props.id === undefined) {
      return MediaFile.getFile() === null;
    } else {
      return !updateData().changed;
    }
  });
  const panelContent = createMemo(() => {
    if (props.id === undefined) {
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

  // ---------------------------------
  // Functions
  const setTranslations = (
    key: "name" | "alt",
    value: string,
    language_id: number
  ) => {
    const prevValues = key === "name" ? getName() : getAlt();
    const itemExists = prevValues.find((item) => {
      return item.language_id === language_id;
    });

    if (itemExists) {
      const newValues = prevValues.map((item) => {
        if (item.language_id === language_id) {
          return {
            ...item,
            value: value,
          };
        }
        return item;
      });
      if (key === "name") setName(newValues);
      if (key === "alt") setAlt(newValues);
    } else {
      const newItem = {
        language_id: language_id,
        value: value,
        key: key,
      };
      const newValues = [...prevValues, newItem];
      if (key === "name") setName(newValues);
      if (key === "alt") setAlt(newValues);
    }
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
          translations: translations(),
        },
      }),
    ]);
    if (response[0].status === "fulfilled") {
      props.state.setOpen(false);
    }
  };
  const buildTranslationArray = (
    key: "alt" | "name",
    data: Array<{
      id?: number | undefined;
      language_id: number;
      value: string | null;
    }>
  ) => {
    const languages = contentLanguageStore.get.languages;

    for (let i = 0; languages.length > i; i++) {
      const language = languages[i];
      const itemExists = data.find((item) => {
        return item.language_id === language.id;
      });
      if (!itemExists) {
        data.push({
          language_id: language.id,
          value: "",
        });
      }
    }

    return data.map((item) => {
      const obj: MediaTranslations = {
        id: item.id,
        language_id: item.language_id,
        value: item.value || "",
        key: key,
      };
      return obj;
    });
  };
  const inputError = (key: "name" | "alt", language_id: number) => {
    const data = translations();
    const index = data.findIndex((item) => {
      return item.key === key && item.language_id === language_id;
    });
    if (index === -1) return undefined;

    const errors = updateSingle.errors()?.errors?.body?.translations.children;
    if (errors) {
      return errors[index]?.value;
    }
    return undefined;
  };

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (translations().length > 0 && props.id === undefined) return;
    const nameTranslations: MediaTranslations[] = [];
    const altTranslations: MediaTranslations[] = [];

    for (const language of languages()) {
      nameTranslations.push({
        language_id: language.id,
        value: "",
        key: "name",
      });
      altTranslations.push({
        language_id: language.id,
        value: "",
        key: "alt",
      });
    }
    setName(nameTranslations);
    setAlt(altTranslations);
  });

  createEffect(() => {
    if (media.isSuccess && props.id !== undefined) {
      if (!getUpdateDataLock()) {
        const nameTranslations = buildTranslationArray(
          "name",
          media.data?.data.name_translations || []
        );
        const altTranslations = buildTranslationArray(
          "alt",
          media.data?.data.alt_translations || []
        );
        setName(nameTranslations);
        setOriginalName(nameTranslations);
        setAlt(altTranslations);
        setOriginalAlt(altTranslations);

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
        if (props.id === undefined) {
          panelSubmitCreate();
        } else {
          panelSubmitUpdate();
        }
      }}
      reset={() => {
        uploadSingleFile.reset();
        updateSingle.reset();
        MediaFile.reset();
        setMediaId(null);
        setName([]);
        setAlt([]);
        setUpdateDataLock(false);
        setUpdateFileLock(false);
      }}
      mutateState={{
        isLoading: mutateIsLoading(),
        errors: mutateErrors(),
        isDisabled: mutateIsDisabled(),
      }}
      content={panelContent()}
      contentLanguage={true}
      hasContentLanguageError={hasTranslationErrors()}
    >
      {(lang) => (
        <>
          <MediaFile.Render />
          <For each={languages()}>
            {(language) => (
              <Show when={language.id === lang?.contentLanguage()}>
                <SectionHeading
                  title={T("details_lang", {
                    code: language.code,
                  })}
                />
                <Form.Input
                  id={`name-${language.id}`}
                  value={
                    getName().find((item) => item.language_id === language.id)
                      ?.value || ""
                  }
                  onChange={(val) => {
                    setTranslations("name", val, language.id);
                  }}
                  name={`name-${language.id}`}
                  type="text"
                  copy={{
                    label: T("name"),
                  }}
                  errors={inputError("name", language.id)}
                />
                <Show when={showAltInput()}>
                  <Form.Input
                    id={`alt-${language.id}`}
                    value={
                      getAlt().find((item) => item.language_id === language.id)
                        ?.value || ""
                    }
                    onChange={(val) => {
                      setTranslations("alt", val, language.id);
                    }}
                    name={`alt-${language.id}`}
                    type="text"
                    copy={{
                      label: T("alt"),
                    }}
                    errors={inputError("alt", language.id)}
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

export default CreateMediaPanel;
