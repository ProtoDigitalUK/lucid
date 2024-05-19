import T from "@/translations";
import { type Component, createSignal, createMemo } from "solid-js";
import { getBodyError } from "@/utils/error-helpers";
import helpers from "@/utils/helpers";
import api from "@/services/api";
import Form from "@/components/Groups/Form";

interface UpdateAccountFormProps {
	firstName: string | undefined;
	lastName: string | undefined;
	username: string | undefined;
	email: string | undefined;
}

const UpdateAccountForm: Component<UpdateAccountFormProps> = (props) => {
	// ----------------------------------------
	// State
	const [firstName, setFirstName] = createSignal(props.firstName ?? "");
	const [lastName, setLastName] = createSignal(props.lastName ?? "");
	const [username, setUsername] = createSignal(props.username ?? "");
	const [email, setEmail] = createSignal(props.email ?? "");

	// ----------------------------------------
	// Mutations
	const updateMe = api.account.useUpdateMe({
		onSuccess: () => {},
	});

	// ----------------------------------------
	// Memos
	const updateData = createMemo(() => {
		return helpers.updateData(
			{
				firstName: props.firstName,
				lastName: props.lastName,
				username: props.username,
				email: props.email,
			},
			{
				firstName: firstName(),
				lastName: lastName(),
				username: username(),
				email: email(),
			},
		);
	});
	const submitIsDisabled = createMemo(() => {
		return !updateData().changed;
	});

	// ----------------------------------------
	// Render
	return (
		<Form.Root
			type="standard"
			state={{
				isLoading: updateMe.action.isPending,
				errors: updateMe.errors(),
				isDisabled: submitIsDisabled(),
			}}
			content={{
				submit: T()("update"),
			}}
			onSubmit={() => {
				updateMe.action.mutate(updateData().data);
			}}
		>
			<div class="grid grid-cols-2 gap-15">
				<Form.Input
					id="firstName"
					name="firstName"
					type="text"
					value={firstName()}
					onChange={setFirstName}
					copy={{
						label: T()("first_name"),
					}}
					required={true}
					autoFoucs={true}
					errors={getBodyError("firstName", updateMe.errors)}
				/>
				<Form.Input
					id="lastName"
					name="lastName"
					type="text"
					value={lastName()}
					onChange={setLastName}
					copy={{
						label: T()("last_name"),
					}}
					required={true}
					autoFoucs={true}
					errors={getBodyError("lastName", updateMe.errors)}
				/>
			</div>
			<Form.Input
				id="username"
				name="username"
				type="text"
				value={username()}
				onChange={setUsername}
				copy={{
					label: T()("username"),
				}}
				required={true}
				autoFoucs={true}
				errors={getBodyError("username", updateMe.errors)}
			/>
			<Form.Input
				id="email"
				name="email"
				type="email"
				value={email()}
				onChange={setEmail}
				copy={{
					label: T()("email"),
				}}
				required={true}
				autoFoucs={true}
				errors={getBodyError("email", updateMe.errors)}
			/>
		</Form.Root>
	);
};

export default UpdateAccountForm;
