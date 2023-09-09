import { createSignal } from "solid-js";
// Types
import { SingleFileUploadProps } from "@/components/Groups/Form/SingleFileUpload";
// Components
import Form from "@/components/Groups/Form";

interface UseSingleFileUploadProps {
  id: SingleFileUploadProps["id"];
  currentFile?: SingleFileUploadProps["currentFile"];
  disableRemoveCurrent?: SingleFileUploadProps["disableRemoveCurrent"];
  name: SingleFileUploadProps["name"];
  copy?: SingleFileUploadProps["copy"];
  accept?: SingleFileUploadProps["accept"];
  required?: SingleFileUploadProps["required"];
  disabled?: SingleFileUploadProps["disabled"];
  errors?: SingleFileUploadProps["errors"];
  noMargin?: SingleFileUploadProps["noMargin"];
}

const useSingleFileUpload = (props: UseSingleFileUploadProps) => {
  // ----------------------------------------
  // State
  const [getFile, setGetFile] = createSignal<File | null>(null);
  const [getRemovedCurrent, setGetRemovedCurrent] =
    createSignal<boolean>(false);

  // ----------------------------------------
  // Render
  return {
    getFile,
    setGetFile,
    getRemovedCurrent,
    setGetRemovedCurrent,
    Render: () => (
      <Form.SingleFileUpload
        state={{
          value: getFile(),
          setValue: setGetFile,
          removedCurrent: getRemovedCurrent(),
          setRemovedCurrent: setGetRemovedCurrent,
        }}
        {...props}
      />
    ),
  };
};

export default useSingleFileUpload;
