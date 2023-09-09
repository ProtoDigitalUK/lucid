import { Component, Switch, Match } from "solid-js";
import {
  FaSolidFileZipper,
  FaSolidFileAudio,
  FaSolidFileVideo,
  FaSolidFile,
  FaSolidFileLines,
} from "solid-icons/fa";
// Types
import { MediaResT } from "@lucid/types/src/media";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
// Utils
import helpers from "@/utils/helpers";
// Components
import AspectRatio from "@/components/Partials/AspectRatio";
import Pill from "@/components/Partials/Pill";
import Image from "@/components/Partials/Image";
import ClickToCopy from "@/components/Partials/ClickToCopy";

interface MediaCardProps {
  media: MediaResT;
  rowTarget: ReturnType<typeof useRowTarget>;
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
    <li
      class="bg-container border-border border rounded-md group overflow-hidden cursor-pointer"
      onClick={() => {
        props.rowTarget.setTargetId(props.media.id);
        props.rowTarget.setTrigger("update", true);
      }}
    >
      {/* Image */}
      <AspectRatio ratio="16:9" innerClass={"overflow-hidden"}>
        <Switch>
          <Match when={props.media.type === "image"}>
            <Image
              classes={
                "rounded-t-md group-hover:scale-110 transition duration-100 backface-hidden"
              }
              src={`${props.media.url}?width=400`}
              alt={props.media.alt || props.media.name}
              loading="lazy"
            />
          </Match>
          <Match when={props.media.type === "archive"}>
            <div class="w-full h-full bg-backgroundAccent flex justify-center items-center group-hover:scale-110 transition duration-100">
              <FaSolidFileZipper size={40} class="fill-primary opacity-40" />
            </div>
          </Match>
          <Match when={props.media.type === "audio"}>
            <div class="w-full h-full bg-backgroundAccent flex justify-center items-center group-hover:scale-110 transition duration-100">
              <FaSolidFileAudio size={40} class="fill-primary opacity-40" />
            </div>
          </Match>
          <Match when={props.media.type === "video"}>
            <div class="w-full h-full bg-backgroundAccent flex justify-center items-center group-hover:scale-110 transition duration-100">
              <FaSolidFileVideo size={40} class="fill-primary opacity-40" />
            </div>
          </Match>
          <Match when={props.media.type === "document"}>
            <div class="w-full h-full bg-backgroundAccent flex justify-center items-center group-hover:scale-110 transition duration-100">
              <FaSolidFileLines size={40} class="fill-primary opacity-40" />
            </div>
          </Match>
          <Match when={props.media.type === "unknown"}>
            <div class="w-full h-full bg-backgroundAccent flex justify-center items-center group-hover:scale-110 transition duration-100">
              <FaSolidFile size={40} class="fill-primary opacity-40" />
            </div>
          </Match>
        </Switch>
        <span class="inset-0 top-auto absolute flex gap-1 p-15">
          <Pill theme="primary">
            {helpers.bytesToSize(props.media.meta.file_size)}
          </Pill>
          <Pill theme="primary">{props.media.meta.file_extension}</Pill>
        </span>
      </AspectRatio>
      {/* Content */}
      <div class="p-15 border-t border-border">
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
