import T from "@/translations";
import { Component, Match, Switch } from "solid-js";
import classNames from "classnames";
// Types
import type { ErrorResult, FieldError } from "@/types/api";
import type { MediaResT } from "@headless/types/src/media";
import type { MediaMetaT } from "@headless/types/src/bricks";
// Store
import mediaSelectStore from "@/store/mediaSelectStore";
// Components
import Button from "@/components/Partials/Button";
import Form from "@/components/Groups/Form";
import AspectRatio from "@/components/Partials/AspectRatio";
import MediaPreview from "@/components/Partials/MediaPreview";

interface MediaSelectProps {
  id: string;
  value: number | undefined;
  meta: MediaMetaT | undefined;
  onChange: (_value: number | null, _meta: MediaMetaT | null) => void;
  extensions?: string[];
  type?: string;
  copy?: {
    label?: string;
    describedBy?: string;
  };
  noMargin?: boolean;
  required?: boolean;
  errors?: ErrorResult | FieldError;
}

export const MediaSelect: Component<MediaSelectProps> = (props) => {
  // -------------------------------
  // Functions
  const parseExtensions = (extensions?: string[]) => {
    if (!extensions) return undefined;
    return extensions
      .map((extension) => {
        return extension.replace(".", "");
      })
      .join(",");
  };
  const openMediaSelectModal = () => {
    mediaSelectStore.set({
      onSelectCallback: (media: MediaResT) => {
        props.onChange(media.id, {
          id: media.id,
          url: media.url,
          key: media.key,
          mime_type: media.meta.mime_type,
          file_extension: media.meta.file_extension,
          file_size: media.meta.file_size,
          type: media.type,
          width: media.meta.width || undefined,
          height: media.meta.height || undefined,
          // TODO: bllow might need to be changed
          name: media.translations[0].name || undefined,
          alt: media.translations[0].alt || undefined,
        });
      },
      open: true,
      extensions: parseExtensions(props.extensions),
      type: props.type,
      selected: props.value,
    });
  };

  // -------------------------------
  // Render
  return (
    <div
      class={classNames("w-full", {
        "mb-0": props.noMargin,
        "mb-2.5 last:mb-0": !props.noMargin,
      })}
    >
      <Form.Label
        id={props.id}
        label={props.copy?.label}
        required={props.required}
        theme={"basic"}
      />
      <div class="mt-2.5 w-full">
        <Switch>
          <Match when={typeof props.value !== "number"}>
            <Button
              type="button"
              theme="container-outline"
              size="x-small"
              onClick={openMediaSelectModal}
            >
              {T("select_media", {
                type: props.type || "media",
              })}
            </Button>
          </Match>
          <Match when={typeof props.value === "number"}>
            <div class="w-full mb-2.5 border border-border p-15 flex items-center justify-center rounded-md">
              <div class="w-full max-w-xs rounded-md overflow-hidden border border-border">
                <AspectRatio ratio="16:9">
                  <MediaPreview
                    media={{
                      url: props.meta?.url || "",
                      type: props.meta?.type || "image",
                    }}
                    alt={props.meta?.alt || props.meta?.name || ""}
                  />
                </AspectRatio>
              </div>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <Button
                type="button"
                theme="container-outline"
                size="x-small"
                onClick={openMediaSelectModal}
              >
                {T("select_new_media", {
                  type: props.type || "media",
                })}
              </Button>
              <Button
                type="button"
                theme="container-outline"
                size="x-small"
                onClick={() => {
                  props.onChange(null, null);
                }}
              >
                {T("remove_media", {
                  type: props.type || "media",
                })}
              </Button>
            </div>
          </Match>
        </Switch>
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
