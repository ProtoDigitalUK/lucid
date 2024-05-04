import { type Component, createMemo, Show } from "solid-js";
import { FaSolidCheck } from "solid-icons/fa";
// Types
import type { MultipleBuilderResT } from "@headless/types/src/multiple-builder"; // TODO: remove

interface PageSearchRowProps {
	page: MultipleBuilderResT;
	contentLanguage?: number;
	selectedId?: number | null;
	onClick: (_page: { slug: string; id: number; title: string }) => void;
}

const PageSearchRow: Component<PageSearchRowProps> = (props) => {
	// ----------------------------------
	// Memos
	const titleTranslation = createMemo(() => {
		return props.page.title_translations.find(
			(translation) => translation.language_id === props.contentLanguage,
		);
	});

	// ----------------------------------
	// Render
	return (
		<li
			class={
				"flex text-sm items-center justify-between even:bg-container-4 even:bg-opacity-60 px-2.5 py-1 hover:bg-container-3 cursor-pointer transition-colors duration-200 ease-in-out"
			}
			onClick={() => {
				props.onClick({
					slug: props.page.slug || "",
					id: props.page.id,
					title: titleTranslation()?.value || "",
				});
			}}
			onKeyDown={() => {}}
		>
			{titleTranslation()?.value}
			<Show when={props.selectedId === props.page.id}>
				<span>
					<FaSolidCheck size={12} class="text-current" />
				</span>
			</Show>
		</li>
	);
};

export default PageSearchRow;
