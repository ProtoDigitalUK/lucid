import T from "@/translations";
import { type Component } from "solid-js";

// Components
import ForgotPasswordForm from "@/components/Forms/Auth/ForgotPasswordForm";

const ForgotPasswordRoute: Component = () => {
	// ----------------------------------------
	// Render
	return (
		<>
			<h1 class="mb-2 text-center 3xl:text-left">
				{T("forgot_password_route_title")}
			</h1>
			<p class="mb-10 text-center 3xl:text-left">
				{T("forgot_password_route_description")}
			</p>
			<div class="mb-10">
				<ForgotPasswordForm showBackToLogin={true} />
			</div>
		</>
	);
};

export default ForgotPasswordRoute;
