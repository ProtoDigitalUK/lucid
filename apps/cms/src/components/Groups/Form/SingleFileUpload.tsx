import {
  Component,
  Switch,
  createMemo,
  Match,
  Show,
  createEffect,
} from "solid-js";
import classnames from "classnames";
// Types
import { ErrorResult } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface SingleFileUploadProps {
  id: string;

  state: {
    value: File | null;
    setValue: (_value: File | null) => void;
    removedCurrent: boolean;
    setRemovedCurrent: (_value: boolean) => void;
  };
  currentFile?: {
    type: string;
    url: string;
    name: string;
  };

  name: string;
  copy?: {
    label?: string;
    describedBy?: string;
  };
  required?: boolean;
  disabled?: boolean;
  errors?: ErrorResult;
  noMargin?: boolean;
}

export const SingleFileUpload: Component<SingleFileUploadProps> = (props) => {
  // ------------------------------------
  // Refs
  let inputRef: HTMLInputElement | undefined;

  // ------------------------------------
  // Functions
  const clearFile = () => {
    props.state.setValue(null);
    props.state.setRemovedCurrent(true);
  };
  const undoToCurrentFile = () => {
    props.state.setValue(null);
    props.state.setRemovedCurrent(false);
  };

  // ------------------------------------
  // Effects
  createEffect(() => {
    if (props.state.value === null) {
      inputRef!.value = "";
    }
  });

  // ------------------------------------
  // Memos
  const showState = createMemo(() => {
    // return: new-file, no-file, current-file
    if (props.state.value !== null) {
      return "new-file";
    }

    if (props.state.removedCurrent && props.state.value === null) {
      return "no-file";
    }

    if (props.state.value === null && props.currentFile !== undefined) {
      return "current-file";
    }

    return "no-file";
  });

  // ------------------------------------
  // Render
  return (
    <div
      class={classnames("w-full", {
        "mb-0": props.noMargin,
        "mb-5": !props.noMargin,
      })}
    >
      <Form.Label
        id={props.id}
        label={props.copy?.label}
        required={props.required}
        noPadding={true}
      />
      <input
        ref={inputRef}
        type="file"
        name={props.name}
        id={props.id}
        // class="hidden"
        onChange={(e) => {
          if (e.currentTarget.files?.length) {
            props.state.setValue(e.currentTarget.files[0]);
            props.state.setRemovedCurrent(false);
          } else {
            props.state.setValue(null);
            props.state.setRemovedCurrent(true);
          }
        }}
      />

      <div class="w-full border-border border-dashed border-2 h-80 rounded-md">
        <Switch>
          <Match when={showState() === "new-file"}>
            <p>new file uploaded</p>
          </Match>
          <Match when={showState() === "no-file"}>
            <p>no file selected</p>
          </Match>
          <Match when={showState() === "current-file"}>
            <p>current file</p>
            {props.currentFile?.url}
          </Match>
        </Switch>

        <Show when={showState() !== "no-file"}>
          <button class="bg-error" onClick={clearFile}>
            clear file
          </button>
        </Show>
        <Show
          when={showState() === "no-file" && props.currentFile !== undefined}
        >
          <button class="bg-primary" onClick={undoToCurrentFile}>
            undo
          </button>
        </Show>
      </div>
      <Form.DescribedBy id={props.id} describedBy={props.copy?.describedBy} />
      <Form.ErrorMessage id={props.id} errors={props.errors} />
    </div>
  );
};
