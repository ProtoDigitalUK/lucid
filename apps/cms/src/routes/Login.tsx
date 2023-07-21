import { type Component } from "solid-js";
import toast from "solid-toast";
// Components
import LoginForm from "@/components/Forms/LoginForm";
import CustomToast from "@/components/Partials/CustomToast";

const LoginRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <div class="">
      <h1 class="mb-2 text-center 3xl:text-left">Welcome back</h1>
      <p class="mb-10 text-center 3xl:text-left">
        Sign in and start managing your content in style
      </p>
      <button
        onClick={() => {
          toast.custom((t) => (
            <CustomToast
              toast={t}
              title="Success"
              message="This is a success toast"
            />
          ));
        }}
      >
        toggle toast
      </button>
      <div class="mb-10">
        <LoginForm showForgotPassword={true} />
      </div>
    </div>
  );
};

export default LoginRoute;
