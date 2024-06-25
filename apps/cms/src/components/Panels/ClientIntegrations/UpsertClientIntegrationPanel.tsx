import T from "@/translations";
import {
	type Accessor,
	type Component,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";
import api from "@/services/api";
import helpers from "@/utils/helpers";
import { getBodyError } from "@/utils/error-helpers";
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";

interface UpsertClientIntegrationPanelProps {
	id?: Accessor<number | undefined>;
	state: {
		open: boolean;
		setOpen: (_state: boolean) => void;
	};
	callbacks?: {
		onCreateSuccess?: (key: string) => void;
	};
}

const UpsertClientIntegrationPanel: Component<
	UpsertClientIntegrationPanelProps
> = (props) => {
	// ---------------------------------
	// State
	const [getName, setName] = createSignal("");
	const [getDescription, setDescription] = createSignal("");
	const [getEnabled, setEnabled] = createSignal<1 | 0>(1);

	// ---------------------------------
	// Query
	const clientIntegration = api.clientIntegrations.useGetSingle({
		queryParams: {
			location: {
				id: props.id as Accessor<number | undefined>,
			},
		},
		key: () => props.state.open,
		enabled: () => props.state.open && props.id !== undefined,
	});

	// ----------------------------------------
	// Mutations
	const createClientIntegration = api.clientIntegrations.useCreateSingle({
		onSuccess: (data) => {
			props.state.setOpen(false);
			props.callbacks?.onCreateSuccess?.(data.data.apiKey);
		},
	});
	const updateClientIntegration = api.clientIntegrations.useUpdateSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
	});

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (clientIntegration.isSuccess) {
			setName(clientIntegration.data?.data.name || "");
			setDescription(clientIntegration.data?.data.description || "");
			setEnabled(clientIntegration.data?.data.enabled || 0);
		}
	});

	// ---------------------------------
	// Memos
	const isLoading = createMemo(() => {
		if (props.id === undefined) return false;
		return clientIntegration.isLoading;
	});
	const isError = createMemo(() => {
		if (props.id === undefined) return false;
		return clientIntegration.isError;
	});

	const panelTitle = createMemo(() => {
		if (props.id === undefined)
			return T()("create_client_integration_panel_title");
		return T()("update_client_integration_panel_title");
	});
	const panelDescription = createMemo(() => {
		if (props.id === undefined)
			return T()("create_client_integration_panel_description");
		return T()("update_client_integration_panel_description");
	});
	const panelSubmit = createMemo(() => {
		if (props.id === undefined) return T()("create");
		return T()("update");
	});

	const updateData = createMemo(() => {
		return helpers.updateData(
			{
				name: clientIntegration.data?.data.name,
				description: clientIntegration.data?.data.description,
				enabled: clientIntegration.data?.data.enabled,
			},
			{
				name: getName(),
				description: getDescription(),
				enabled: getEnabled(),
			},
		);
	});
	const submitIsDisabled = createMemo(() => {
		if (!props.id) return false;
		return !updateData().changed;
	});
	// Mutation memos
	const isCreating = createMemo(() => {
		return (
			createClientIntegration.action.isPending ||
			updateClientIntegration.action.isPending
		);
	});
	const errors = createMemo(() => {
		if (!props.id) return createClientIntegration.errors();
		return updateClientIntegration.errors();
	});

	// ---------------------------------
	// Return
	return (
		<Panel.Root
			open={props.state.open}
			setOpen={props.state.setOpen}
			onSubmit={() => {
				if (!props.id) {
					createClientIntegration.action.mutate({
						name: getName(),
						description: getDescription(),
						enabled: getEnabled(),
					});
				} else {
					updateClientIntegration.action.mutate({
						id: props.id() as number,
						body: updateData().data,
					});
				}
			}}
			reset={() => {
				setName("");
				setDescription("");
				setEnabled(1);
				createClientIntegration.reset();
				updateClientIntegration.reset();
			}}
			fetchState={{
				isLoading: isLoading(),
				isError: isError(),
			}}
			mutateState={{
				isLoading: isCreating(),
				isDisabled: submitIsDisabled(),
				errors: errors(),
			}}
			content={{
				title: panelTitle(),
				description: panelDescription(),
				submit: panelSubmit(),
			}}
		>
			{() => (
				<>
					<Form.Input
						id="name"
						name="name"
						type="text"
						value={getName()}
						onChange={setName}
						copy={{
							label: T()("name"),
						}}
						required={true}
						errors={getBodyError("name", errors)}
					/>
					<Form.Textarea
						id="description"
						name="description"
						value={getDescription()}
						onChange={setDescription}
						copy={{
							label: T()("description"),
						}}
						rows={3}
						errors={getBodyError("description", errors)}
					/>
					<Form.Checkbox
						id="enabled"
						name="enabled"
						value={getEnabled() === 1}
						onChange={(value) => setEnabled(value ? 1 : 0)}
						copy={{
							label: T()("enabled"),
						}}
						errors={getBodyError("enabled", errors)}
					/>
				</>
			)}
		</Panel.Root>
	);
};

export default UpsertClientIntegrationPanel;
