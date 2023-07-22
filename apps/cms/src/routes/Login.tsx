import { type Component } from "solid-js";
// Components
import LoginForm from "@/components/Forms/LoginForm";

const LoginRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <>
      <h1 class="mb-2 text-center 3xl:text-left">Welcome back</h1>
      <p class="mb-10 text-center 3xl:text-left">
        Sign in and start managing your content in style
      </p>
      <div class="mb-10">
        <LoginForm showForgotPassword={true} />
      </div>
    </>
  );
};

export default LoginRoute;
