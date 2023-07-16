import { type Component } from "solid-js";

// Components
import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm";

const ForgotPasswordRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <div class="">
      <h1 class="mb-2">Forgot Password</h1>
      <p class="mb-10">
        Enter your email address and we'll send you a link to reset your
      </p>
      <div class="mb-10">
        <ForgotPasswordForm showBackToLogin={true} />
      </div>
    </div>
  );
};

export default ForgotPasswordRoute;
