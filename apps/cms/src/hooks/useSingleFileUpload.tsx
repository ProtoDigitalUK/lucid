import { Accessor, createSignal } from "solid-js";
// Types
import { SingleFileUploadProps } from "@/components/Groups/Form/SingleFileUpload";
import { APIErrorResponse } from "@/types/api";
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
	errors?: Accessor<APIErrorResponse | undefined>;
	noMargin?: SingleFileUploadProps["noMargin"];
}

const useSingleFileUpload = (data: UseSingleFileUploadProps) => {
	// ----------------------------------------
	// State
	const [getFile, setGetFile] = createSignal<File | null>(null);
	const [getRemovedCurrent, setGetRemovedCurrent] =
		createSignal<boolean>(false);
	const [getCurrentFile, setCurrentFile] = createSignal<
		SingleFileUploadProps["currentFile"]
	>(data.currentFile);

	// ----------------------------------------
	// Render
	return {
		getFile,
		setGetFile,
		getRemovedCurrent,
		setGetRemovedCurrent,
		getCurrentFile,
		setCurrentFile,
		reset: () => {
			setGetFile(null);
			setGetRemovedCurrent(false);
			setCurrentFile(data.currentFile);
		},
		Render: () => (
			<Form.SingleFileUpload
				state={{
					value: getFile(),
					setValue: setGetFile,
					removedCurrent: getRemovedCurrent(),
					setRemovedCurrent: setGetRemovedCurrent,
				}}
				currentFile={getCurrentFile()}
				disableRemoveCurrent={data.disableRemoveCurrent}
				id={data.id}
				name={data.name}
				copy={data.copy}
				accept={data.accept}
				required={data.required}
				disabled={data.disabled}
				errors={
					data.errors
						? data.errors()?.errors?.body[data.name]
						: undefined
				}
				noMargin={data.noMargin}
			/>
		),
	};
};

export default useSingleFileUpload;
