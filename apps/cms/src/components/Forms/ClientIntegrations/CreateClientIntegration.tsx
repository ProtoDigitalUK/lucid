import T from "@/translations";
import { type Component, createSignal } from "solid-js";
import { getBodyError } from "@/utils/error-helpers";
import api from "@/services/api";
import Form from "@/components/Groups/Form";

const CreateClientIntegration: Component = (props) => {
	// ----------------------------------------
	// State
	const [getName, setName] = createSignal("");
	const [getDescription, setDescription] = createSignal("");
	const [getEnabled, setEnabled] = createSignal<1 | 0>(1);

	// ----------------------------------------
	// Mutations
	const createClientIntegration = api.clientIntegrations.useCreateSingle({
		onSuccess: () => {
			setName("");
			setDescription("");
			setEnabled(1);
			// TODO: show copy api key modal
		},
	});

	// ----------------------------------------
	// Render
	return (
		<Form.Root
			type="standard"
			state={{
				isLoading: createClientIntegration.action.isPending,
				errors: createClientIntegration.errors(),
			}}
			content={{
				submit: T()("create_integration"),
			}}
			onSubmit={() => {
				createClientIntegration.action.mutate({
					name: getName(),
					description: getDescription(),
					enabled: getEnabled(),
				});
			}}
		>
			<h3 class="mb-15">{T()("create_a_new_integration")}</h3>
			<Form.Input
				id="name"
				name="name"
				type="text"
				value={getName()}
				onChange={setName}
				copy={{
					label: T()("name"),
				}}
				errors={getBodyError("name", createClientIntegration.errors)}
			/>
			<Form.Textarea
				id="description"
				name="description"
				value={getDescription()}
				onChange={setDescription}
				copy={{
					label: T()("description"),
				}}
				errors={getBodyError(
					"description",
					createClientIntegration.errors,
				)}
				rows={3}
			/>
		</Form.Root>
	);
};

export default CreateClientIntegration;
