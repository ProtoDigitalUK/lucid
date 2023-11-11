import T from "@/translations";
import {
  Component,
  createMemo,
  createSignal,
  Show,
  For,
  createEffect,
} from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
// Utils
import helpers from "@/utils/helpers";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import TranslationGroup from "@/components/Partials/TranslationGroup";

interface CreateMediaPanelProps {
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

interface MediaTranslations {
  language_id: number;
  value: string;
  key: "alt" | "name";
}

const CreateMediaPanel: Component<CreateMediaPanelProps> = (props) => {
  // ------------------------------
  // State
  const [getAlt, setAlt] = createSignal<Array<MediaTranslations>>([]);
  const [getName, setName] = createSignal<Array<MediaTranslations>>([]);

  const [getMediaId, setMediaId] = createSignal<number | null>(null);

  // ---------------------------------
  // Mutations
  const uploadSingleFile = api.media.useUploadFileSingle();
  const updateSingle = api.media.useUpdateSingle();

  const MediaFile = useSingleFileUpload({
    id: "file",
    disableRemoveCurrent: true,
    name: "file",
    required: true,
    errors: uploadSingleFile.errors,
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
  const languages = createMemo(() => contentLanguageStore.get.languages);

  const mutateIsLoading = createMemo(() => {
    return uploadSingleFile.action.isLoading || updateSingle.action.isLoading;
  });
  const mutateErrors = createMemo(() => {
    return uploadSingleFile.errors() || updateSingle.errors();
  });

  const translations = createMemo(() => [...getAlt(), ...getName()]);

  // ---------------------------------
  // Functions
  const setTranslations = (
    key: "name" | "alt",
    value: string,
    language_id: number
  ) => {
    const prevValues = key === "name" ? getName() : getAlt();

    const newItem = {
      language_id: language_id,
      value: value,
      key: key,
    };

    const itemExists = prevValues.find((item) => {
      return item.language_id === language_id;
    });
    if (itemExists) {
      const newValues = prevValues.map((item) => {
        if (item.language_id === newItem.language_id) {
          return newItem;
        }
        return item;
      });
      if (key === "name") setName(newValues);
      else setAlt(newValues);
    } else {
      if (key === "name") setName([...prevValues, newItem]);
      else setAlt([...prevValues, newItem]);
    }
  };
  const panelSubmit = async () => {
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
    if (translations().length > 0) return;
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

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={panelSubmit}
      reset={() => {
        uploadSingleFile.reset();
        updateSingle.reset();
        MediaFile.reset();
        setMediaId(null);
        setName([]);
        setAlt([]);
      }}
      mutateState={{
        isLoading: mutateIsLoading(),
        errors: mutateErrors(),
        isDisabled: MediaFile.getFile() === null,
      }}
      content={{
        title: T("create_media_panel_title"),
        description: T("create_media_panel_description"),
        submit: T("create"),
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
        </>
      )}
    </Panel.Root>
  );
};

export default CreateMediaPanel;
