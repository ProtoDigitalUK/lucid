import T from "@/translations";
import { type Component, createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
// Services
import api from "@/services/api";
// Components
import Form from "@/components/Groups/Form";

interface LoginFormProps {
	showForgotPassword?: boolean;
}

const LoginForm: Component<LoginFormProps> = (props) => {
	// ----------------------------------------
	// State
	const [usernameOrEmail, setUsernameOrEmail] = createSignal("");
	const [password, setPassword] = createSignal("");

	// ----------------------------------------
	// Mutations
	const login = api.auth.useLogin();

	// ----------------------------------------
	// Render
	return (
		<Form.Root
			type="standard"
			state={{
				isLoading: login.action.isPending,
				errors: login.errors(),
			}}
			content={{
				submit: "Login",
			}}
			onSubmit={() => {
				login.action.mutate({
					username_or_email: usernameOrEmail(),
					password: password(),
				});
			}}
		>
			<Form.Input
				id="username_or_email"
				name="username_or_email"
				type="text"
				value={usernameOrEmail()}
				onChange={setUsernameOrEmail}
				copy={{
					label: T("username_or_email"),
				}}
				required={true}
				autoFoucs={true}
				autoComplete="username"
				errors={login.errors()?.errors?.body?.username}
			/>
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
				autoComplete="current-password"
				errors={login.errors()?.errors?.body?.password}
			/>
			<Show when={props.showForgotPassword}>
				<Link
					class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
					type="button"
					href="/forgot-password"
				>
					{T("forgot_password")}
				</Link>
			</Show>
		</Form.Root>
	);
};

export default LoginForm;
