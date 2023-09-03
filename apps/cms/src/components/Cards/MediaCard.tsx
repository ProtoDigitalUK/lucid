import { Component, Switch, Match } from "solid-js";
// Types
import { MediaResT } from "@lucid/types/src/media";
// Utils
import helpers from "@/utils/helpers";
// Components
import AspectRatio from "@/components/Partials/AspectRatio";
import Pill from "@/components/Partials/Pill";
import Image from "@/components/Partials/Image";
import ClickToCopy from "@/components/Partials/ClickToCopy";

interface MediaCardProps {
  media: MediaResT;
}

export const MediaCardLoading: Component = () => {
  // ----------------------------------
  // Return
  return (
    <li class={"bg-container border-border border rounded-md"}>
      <AspectRatio ratio="16:9">
        <span class="skeleton block w-full h-full rounded-b-none" />
      </AspectRatio>
      <div class="p-15">
        <span class="skeleton block h-5 w-1/2 mb-2" />
        <span class="skeleton block h-5 w-full" />
      </div>
    </li>
  );
};

const MediaCard: Component<MediaCardProps> = (props) => {
  // ----------------------------------
  // Return
  return (
    <li class="bg-container border-border border rounded-md">
      {/* Image */}
      <AspectRatio ratio="16:9">
        <Switch>
          <Match when={props.media.type === "image"}>
            <Image
              classes={"rounded-t-md"}
              src={`${props.media.url}?width=400`}
              alt={props.media.alt || props.media.name}
              loading="lazy"
            />
          </Match>
        </Switch>
        <div class="inset-0 absolute flex gap-2.5 items-end p-15">
          <Pill theme="primary">
            {helpers.bytesToSize(props.media.meta.file_size)}
          </Pill>
          <Pill theme="primary">{props.media.meta.file_extension}</Pill>
        </div>
      </AspectRatio>
      {/* Content */}
      <div class="p-15">
        <h3 class="mb-0.5 line-clamp-1">{props.media.name}</h3>
        <ClickToCopy
          type="simple"
          text={props.media.key}
          value={props.media.url}
        />
      </div>
    </li>
  );
};

export default MediaCard;
