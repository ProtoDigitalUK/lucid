import { type Component } from "solid-js";

// Components
import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm";

const ForgotPasswordRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <>
      <h1 class="mb-2 text-center 3xl:text-left">Forgot Password</h1>
      <p class="mb-10 text-center 3xl:text-left">
        Enter your email address and we'll send you a link to reset your
      </p>
      <div class="mb-10">
        <ForgotPasswordForm showBackToLogin={true} />
      </div>
    </>
  );
};

export default ForgotPasswordRoute;
