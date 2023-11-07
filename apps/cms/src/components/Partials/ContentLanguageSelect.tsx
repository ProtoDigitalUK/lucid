import { Component, Match, Switch, createMemo } from "solid-js";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
// Components
import Form from "@/components/Groups/Form";

interface ContentLanguageSelectProps {
  value?: number | undefined;
  setValue?: (_value: number | undefined) => void;
}

const ContentLanguageSelect: Component<ContentLanguageSelectProps> = (
  props
) => {
  // ----------------------------------
  // Memos
  const contentLanguage = createMemo(
    () => contentLanguageStore.get.contentLanguage
  );
  const languages = createMemo(() => contentLanguageStore.get.languages);

  // ----------------------------------------
  // Render
  return (
    <Switch>
      <Match when={props.value === undefined}>
        <Form.Select
          id={`content-language`}
          value={contentLanguage()}
          onChange={(value) => {
            if (!value) contentLanguageStore.get.setContentLanguage(undefined);
            else contentLanguageStore.get.setContentLanguage(Number(value));
          }}
          name={`content-language`}
          options={
            languages().map((language) => ({
              value: language.id,
              label: language.name
                ? `${language.name} (${language.code})`
                : language.code,
            })) || []
          }
          noMargin={true}
          noClear={true}
        />
      </Match>
      <Match when={props.value !== undefined}>
        <Form.Select
          id={`content-language`}
          value={props.value}
          onChange={(value) => {
            if (!value) props.setValue?.(undefined);
            else props.setValue?.(Number(value));
          }}
          name={`content-language`}
          options={
            languages().map((language) => ({
              value: language.id,
              label: language.name
                ? `${language.name} (${language.code})`
                : language.code,
            })) || []
          }
          noMargin={true}
          noClear={true}
        />
      </Match>
    </Switch>
  );
};

export default ContentLanguageSelect;
