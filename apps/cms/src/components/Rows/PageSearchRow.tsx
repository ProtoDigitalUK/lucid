import { Component, createMemo } from "solid-js";
// Utils
import helpers from "@/utils/helpers";
// Types
import type { PagesResT } from "@headless/types/src/pages";

interface PageSearchRowProps {
  page: PagesResT;
  contentLanguage?: number;
  onClick: (_page: { slug: string; id: number }) => void;
}

const PageSearchRow: Component<PageSearchRowProps> = (props) => {
  // ----------------------------------
  // Memos
  const currentTranslation = createMemo(() => {
    return props.page.translations.find(
      (translation) => translation.language_id === props.contentLanguage
    );
  });

  const translationContent = createMemo(() => {
    return helpers.getPageContentTranslations({
      translations: currentTranslation(),
      default_title: props.page.default_title,
      default_slug: props.page.default_slug,
    });
  });

  // ----------------------------------
  // Render
  return (
    <li
      class="flex text-sm justify-between even:bg-backgroundAccent even:bg-opacity-60 px-2.5 py-1 hover:bg-backgroundAccentH cursor-pointer transition-colors duration-200 ease-in-out"
      onClick={() => {
        props.onClick({
          slug: translationContent().slug.value,
          id: props.page.id,
        });
      }}
    >
      {translationContent().title.value}
    </li>
  );
};

export default PageSearchRow;
