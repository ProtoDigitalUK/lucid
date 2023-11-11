import T from "@/translations";
import {
  Component,
  Accessor,
  createMemo,
  createSignal,
  createEffect,
  Show,
  For,
} from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
// Utils
import helpers from "@/utils/helpers";
import dateHelpers from "@/utils/date-helpers";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import DetailsList from "@/components/Partials/DetailsList";
import TranslationGroup from "@/components/Partials/TranslationGroup";

interface UpdateMediaPanelProps {
  id: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

interface MediaTranslations {
  id?: number;
  language_id: number;
  value: string;
  key: "alt" | "name";
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

  // ---------------------------------
  // Mutations
  const updateSingle = api.media.useUpdateSingle();
  const updateSingleFile = api.media.useUpdateFileSingle();

  const MediaFile = useSingleFileUpload({
    id: "file",
    disableRemoveCurrent: true,
    name: "file",
    required: true,
    errors: updateSingleFile.errors,
    noMargin: false,
  });

  // ---------------------------------
  // Functions
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
  const panelSubmit = async () => {
    const resultes = await Promise.allSettled([
      updateSingle.action.mutateAsync({
        id: props.id() as number,
        body: {
          translations: updateData().data.translations || [],
        },
      }),
      MediaFile.getFile() !== null
        ? updateSingleFile.action.mutateAsync({
            id: props.id() as number,
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
    if (media.isSuccess) {
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
  // Memos
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
  const showAltInput = createMemo(() => {
    if (MediaFile.getFile() !== null) {
      const type = helpers.getMediaType(MediaFile.getFile()?.type);
      return type === "image";
    }
    return media.data?.data.type === "image";
  });
  const languages = createMemo(() => contentLanguageStore.get.languages);
  const mutateIsLoading = createMemo(() => {
    return updateSingle.action.isLoading || updateSingleFile.action.isLoading;
  });
  const mutateErrors = createMemo(() => {
    return updateSingle.errors() || updateSingleFile.errors();
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={panelSubmit}
      reset={() => {
        updateSingle.reset();
        updateSingleFile.reset();

        setUpdateDataLock(false);
        setUpdateFileLock(false);
      }}
      fetchState={{
        isLoading: media.isLoading,
        isError: media.isError,
      }}
      mutateState={{
        isLoading: mutateIsLoading(),
        isDisabled: !updateData().changed,
        errors: mutateErrors(),
      }}
      content={{
        title: T("update_media_panel_title"),
        description: T("update_media_panel_description"),
        submit: T("update"),
      }}
    >
      {() => (
        <>
          <MediaFile.Render />
          <SectionHeading title={T("translations")} />
          <For each={languages()}>
            {(language) => (
              <TranslationGroup name={language.name} code={language.code}>
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
                  theme="slim"
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
                    theme="slim"
                  />
                </Show>
              </TranslationGroup>
            )}
          </For>
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
        </>
      )}
    </Panel.Root>
  );
};

export default UpdateMediaPanel;
