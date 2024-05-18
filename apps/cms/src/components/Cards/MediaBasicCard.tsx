import T from "@/translations";
import { type Component, createMemo } from "solid-js";
import classNames from "classnames";
import type { MediaResponse } from "@lucidcms/core/types";
import helpers from "@/utils/helpers";
import AspectRatio from "@/components/Partials/AspectRatio";
import MediaPreview from "@/components/Partials/MediaPreview";

interface MediaBasicCardProps {
	media: MediaResponse;
	selected: boolean;
	contentLocale?: string;
	onClick?: () => void;
}

export const MediaBasicCardLoading: Component = () => {
	// ----------------------------------
	// Return
	return (
		<li class={"bg-container-2 border-border border rounded-md"}>
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
		return helpers.getTranslation(
			props.media.titleTranslations,
			props.contentLocale,
		);
	});
	const altTranslations = createMemo(() => {
		return helpers.getTranslation(
			props.media.altTranslations,
			props.contentLocale,
		);
	});

	// ----------------------------------
	// Return
	return (
		<li
			class={classNames(
				"bg-container-2 border-border border rounded-md group overflow-hidden relative cursor-pointer",
				{
					"border-primary-base": props.selected,
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
					alt={altTranslations() || titleTranslations() || ""}
				/>
			</AspectRatio>
			{/* Content */}
			<div class="p-2.5 border-t border-border">
				<h3 class="line-clamp-1 text-sm">
					{titleTranslations() || T()("no_translation")}
				</h3>
			</div>
		</li>
	);
};

export default MediaBasicCard;
