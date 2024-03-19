import T from "@/translations";
import { type Component, createSignal } from "solid-js";
// Components
import Form from "@/components/Groups/Form";
// Services
import api from "@/services/api";

interface ResetPasswordFormProps {
	token: string;
}

const ResetPasswordForm: Component<ResetPasswordFormProps> = (props) => {
	// ----------------------------------------
	// State
	const [password, setPassword] = createSignal("");
	const [passwordConfirmation, setPasswordConfirmation] = createSignal("");

	// ----------------------------------------
	// Mutations
	const resetPassword = api.account.useResetPassword();

	// ----------------------------------------
	// Render
	return (
		<Form.Root
			type="standard"
			state={{
				isLoading: resetPassword.action.isPending,
				errors: resetPassword.errors(),
			}}
			content={{
				submit: T("reset_password"),
			}}
			onSubmit={() => {
				resetPassword.action.mutate({
					token: props.token,
					password: password(),
					password_confirmation: passwordConfirmation(),
				});
			}}
		>
			<Form.Input
				id="password"
				name="password"
				type="password"
				value={password()}
				onChange={setPassword}
				copy={{
					label: T("password"),
				}}
				required={true}
				autoFoucs={true}
				errors={resetPassword.errors()?.errors?.body?.password}
			/>
			<Form.Input
				id="password_confirmation"
				name="password_confirmation"
				type="password"
				value={passwordConfirmation()}
				onChange={setPasswordConfirmation}
				copy={{
					label: T("confirm_password"),
				}}
				required={true}
				errors={
					resetPassword.errors()?.errors?.body?.password_confirmation
				}
			/>
		</Form.Root>
	);
};

export default ResetPasswordForm;
