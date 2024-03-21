import T from "@/translations";
import { type Component, Switch, Match } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
// Services
import api from "@/services/api";
// Assets
import notifyIllustration from "@/assets/illustrations/notify.svg";
// Components
import ResetPasswordForm from "@/components/Forms/Auth/ResetPasswordForm";
import Loading from "@/components/Partials/Loading";
import ErrorBlock from "@/components/Partials/ErrorBlock";

const ResetPasswordRoute: Component = () => {
	// ----------------------------------------
	// State
	const location = useLocation();
	const navigate = useNavigate();

	// get token from url
	const urlParams = new URLSearchParams(location.search);
	const token = urlParams.get("token");

	if (!token) {
		navigate("/login");
	}

	// ----------------------------------------
	// Queries / Mutations
	const checkToken = api.account.useVerifyResetToken({
		queryParams: {
			location: {
				token: token as string,
			},
		},
		enabled: () => token !== null,
	});

	// ----------------------------------------
	// Render
	return (
		<Switch>
			<Match when={checkToken.isLoading}>
				<Loading type="fill" />
			</Match>
			<Match when={checkToken.isError}>
				<ErrorBlock
					type={"fill"}
					content={{
						image: notifyIllustration,
						title: T("token_provided_invalid"),
						description: T("token_provided_invalid_description"),
					}}
					link={{
						text: T("back_to_login"),
						href: "/login",
					}}
				/>
			</Match>
			<Match when={checkToken.isSuccess}>
				<h1 class="mb-2 text-center 3xl:text-left">
					{T("reset_password_route_title")}
				</h1>
				<p class="mb-10 text-center 3xl:text-left">
					{T("reset_password_route_description")}
				</p>
				<div class="mb-10">
					<ResetPasswordForm token={token as string} />
				</div>
			</Match>
		</Switch>
	);
};

export default ResetPasswordRoute;
