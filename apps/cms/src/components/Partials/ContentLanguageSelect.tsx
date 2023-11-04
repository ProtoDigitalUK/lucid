import { Component, Match, Switch, Accessor } from "solid-js";
// Services
import api from "@/services/api";
// Store
import {
  contentLanguage,
  setContentLanguage,
} from "@/store/contentLanguageStore";
// Components
import Form from "@/components/Groups/Form";

interface ContentLanguageSelectProps {
  value?: Accessor<number | undefined>;
  setValue?: (_value: number | undefined) => void;
}

const ContentLanguageSelect: Component<ContentLanguageSelectProps> = (
  props
) => {
  // ----------------------------------
  // Mutations & Queries
  const languages = api.languages.useGetMultiple({
    queryParams: {
      queryString: "?sort=code",
      perPage: -1,
    },
  });

  // ----------------------------------------
  // Render
  return (
    <Switch>
      <Match when={props.value === undefined}>
        <Form.Select
          id={`content-language`}
          value={contentLanguage()}
          onChange={(value) => {
            if (!value) setContentLanguage(undefined);
            else setContentLanguage(Number(value));
          }}
          name={`content-language`}
          options={
            languages.data?.data.map((language) => ({
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
          value={props.value ? props.value() : undefined}
          onChange={(value) => {
            if (!value) props.setValue?.(undefined);
            else props.setValue?.(Number(value));
          }}
          name={`content-language`}
          options={
            languages.data?.data.map((language) => ({
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
