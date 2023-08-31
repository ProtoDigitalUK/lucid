import { Component } from "solid-js";
// Types
import { MediaResT } from "@lucid/types/src/media";
// Utils
import helpers from "@/utils/helpers";
// Components
import AspectRatio from "@/components/Partials/AspectRatio";
import Pill from "@/components/Partials/Pill";
import Image from "@/components/Partials/Image";

interface MediaCardProps {
  media: MediaResT;
}

export const MediaCardLoading: Component = () => {
  // ----------------------------------
  // Return
  return (
    <li class={"bg-container p-15 border-border border rounded-md"}>
      <span class="skeleton block h-5 w-1/2 mb-1" />
      <span class="skeleton block h-5 w-full mb-2.5" />
      <span class="skeleton block h-32 w-full" />
    </li>
  );
};

const MediaCard: Component<MediaCardProps> = (props) => {
  // ----------------------------------
  // Return
  return (
    <li class="bg-container border-border border rounded-md">
      {/* Image */}
      <div class="p-1.5 pb-0">
        <AspectRatio ratio="16:9">
          <Image
            classes={"rounded-md"}
            src={props.media.url}
            alt={props.media.alt || props.media.name}
            loading="lazy"
          />
        </AspectRatio>
      </div>
      {/* Content */}
      <div class="p-15 pt-2.5">
        <h3 class="">{props.media.name}</h3>
        <Pill theme="grey">
          {helpers.bytesToSize(props.media.meta.file_size)}
        </Pill>
        <Pill theme="grey">{props.media.meta.file_extension}</Pill>
      </div>
    </li>
  );
};

export default MediaCard;
