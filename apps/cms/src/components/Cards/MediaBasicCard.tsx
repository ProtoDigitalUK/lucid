import T from "@/translations";
import { type Component, createMemo } from "solid-js";
import classNames from "classnames";
// Types
import type { MediaResT } from "@headless/types/src/media";
// Components
import AspectRatio from "@/components/Partials/AspectRatio";
import MediaPreview from "@/components/Partials/MediaPreview";

interface MediaBasicCardProps {
	media: MediaResT;
	selected: boolean;
	contentLanguage?: number;
	onClick?: () => void;
}

export const MediaBasicCardLoading: Component = () => {
	// ----------------------------------
	// Return
	return (
		<li class={"bg-container border-border border rounded-md"}>
			<AspectRatio ratio="16:9">
				<span class="skeleton block w-full h-full rounded-b-none" />
			</AspectRatio>
			<div class="p-2.5">
				<span class="skeleton block h-5 w-1/2 mb-2" />
				<span class="skeleton block h-5 w-full" />
			</div>
		</li>
	);
};

const MediaBasicCard: Component<MediaBasicCardProps> = (props) => {
	// ----------------------------------
	// Memos
	const titleTranslations = createMemo(() => {
		return props.media.title_translations.find(
			(translation) => translation.language_id === props.contentLanguage,
		);
	});
	const altTranslations = createMemo(() => {
		return props.media.alt_translations.find(
			(translation) => translation.language_id === props.contentLanguage,
		);
	});

	// ----------------------------------
	// Return
	return (
		<li
			class={classNames(
				"bg-container border-border border rounded-md group overflow-hidden relative cursor-pointer",
				{
					"border-secondary": props.selected,
				},
			)}
			onClick={() => {
				props.onClick?.();
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					props.onClick?.();
				}
			}}
		>
			{/* Image */}
			<AspectRatio ratio="16:9" innerClass={"overflow-hidden"}>
				<MediaPreview
					media={props.media}
					alt={
						altTranslations()?.value ||
						titleTranslations()?.value ||
						""
					}
				/>
			</AspectRatio>
			{/* Content */}
			<div class="p-2.5 border-t border-border">
				<h3 class="line-clamp-1 text-sm">
					{titleTranslations()?.value || T("no_translation")}
				</h3>
			</div>
		</li>
	);
};

export default MediaBasicCard;
