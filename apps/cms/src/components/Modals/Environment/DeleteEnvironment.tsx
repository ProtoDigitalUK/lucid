import T from "@/translations";
import { Component } from "solid-js";
// Components
import Modal from "@/components/Groups/Modal";
// Services
import api from "@/services/api";

interface DeleteEnvironmentProps {
	key?: string;
	state: {
		open: boolean;
		setOpen: (_open: boolean) => void;
	};
}

const DeleteEnvironment: Component<DeleteEnvironmentProps> = (props) => {
	// ----------------------------------------
	// Mutations
	const deleteEnvironment = api.environment.useDeleteSingle({
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
				isLoading: deleteEnvironment.action.isPending,
				isError: deleteEnvironment.action.isError,
			}}
			content={{
				title: T("delete_environment_modal_title"),
				description: T("delete_environment_modal_description"),
				error: deleteEnvironment.errors()?.message,
			}}
			onConfirm={() => {
				if (!props.key) return console.error("No key provided");

				deleteEnvironment.action.mutate({
					key: props.key,
				});
			}}
			onCancel={() => {
				props.state.setOpen(false);
				deleteEnvironment.reset();
			}}
		/>
	);
};

export default DeleteEnvironment;
