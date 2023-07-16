import { type Component } from "solid-js";

// Components
import LoginForm from "@/components/Forms/LoginForm";

const LoginRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <div class="">
      <h1 class="mb-2">Welcome back</h1>
      <p class="mb-10">Sign in and start managing your content in style</p>
      <div class="mb-10">
        <LoginForm showForgotPassword={true} />
      </div>
    </div>
  );
};

export default LoginRoute;
