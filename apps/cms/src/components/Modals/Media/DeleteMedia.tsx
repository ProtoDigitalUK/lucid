import T from "@/translations";
import type { Component, Accessor } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface DeleteMediaProps {
	id: Accessor<number | undefined>;
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
}

const DeleteMedia: Component<DeleteMediaProps> = (props) => {
	// ----------------------------------------
	// Mutations
	const deleteMedia = api.media.useDeleteSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
	});

	// ------------------------------
	// Render
	return (
		<Modal.Confirmation
			state={{
				open: props.state.open,
				setOpen: props.state.setOpen,
				isLoading: deleteMedia.action.isPending,
				isError: deleteMedia.action.isError,
			}}
			content={{
				title: T("delete_media_modal_title"),
				description: T("delete_media_modal_description"),
				error: deleteMedia.errors()?.message,
			}}
			onConfirm={() => {
				const id = props.id();
				if (!id) return console.error("No id provided");
				deleteMedia.action.mutate({
					id: id,
				});
			}}
			onCancel={() => {
				props.state.setOpen(false);
				deleteMedia.reset();
			}}
		/>
	);
};

export default DeleteMedia;
