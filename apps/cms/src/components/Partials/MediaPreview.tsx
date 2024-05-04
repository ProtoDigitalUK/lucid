import { type Component, Switch, Match } from "solid-js";
import {
	FaSolidFileZipper,
	FaSolidFileAudio,
	FaSolidFileVideo,
	FaSolidFile,
	FaSolidFileLines,
} from "solid-icons/fa";
import type { MediaResponse } from "@lucidcms/core/types";
import Image from "@/components/Partials/Image";

interface MediaPreviewProps {
	media: {
		type: MediaResponse["type"];
		url: string;
	};
	alt: string | null;
}

const MediaPreview: Component<MediaPreviewProps> = (props) => {
	// -------------------------------
	// Render
	return (
		<Switch>
			<Match when={props.media.type === "image"}>
				<Image
					classes={
						"rounded-t-md group-hover:scale-110 transition duration-100 backface-hidden"
					}
					src={`${props.media.url}?width=400`}
					alt={props.alt || ""}
					loading="lazy"
				/>
			</Match>
			<Match when={props.media.type === "archive"}>
				<div class="w-full h-full bg-container-4 flex justify-center items-center group-hover:scale-110 transition duration-100">
					<FaSolidFileZipper
						size={40}
						class="text-primary-base opacity-40"
					/>
				</div>
			</Match>
			<Match when={props.media.type === "audio"}>
				<div class="w-full h-full bg-container-4 flex justify-center items-center group-hover:scale-110 transition duration-100">
					<FaSolidFileAudio
						size={40}
						class="text-primary-base opacity-40"
					/>
				</div>
			</Match>
			<Match when={props.media.type === "video"}>
				<div class="w-full h-full bg-container-4 flex justify-center items-center group-hover:scale-110 transition duration-100">
					<FaSolidFileVideo
						size={40}
						class="text-primary-base opacity-40"
					/>
				</div>
			</Match>
			<Match when={props.media.type === "document"}>
				<div class="w-full h-full bg-container-4 flex justify-center items-center group-hover:scale-110 transition duration-100">
					<FaSolidFileLines
						size={40}
						class="text-primary-base opacity-40"
					/>
				</div>
			</Match>
			<Match when={props.media.type === "unknown"}>
				<div class="w-full h-full bg-container-4 flex justify-center items-center group-hover:scale-110 transition duration-100">
					<FaSolidFile
						size={40}
						class="text-primary-base opacity-40"
					/>
				</div>
			</Match>
		</Switch>
	);
};

export default MediaPreview;
