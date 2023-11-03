import { Component } from "solid-js";
// Services
import api from "@/services/api";
// Store
import {
  contentLanguage,
  setContentLanguage,
} from "@/store/contentLanguageStore";
// Components
import Form from "@/components/Groups/Form";

const ContentLanguageSelect: Component = () => {
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
    <div class="w-full md:max-w-[200px] mr-2.5">
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
    </div>
  );
};

export default ContentLanguageSelect;
