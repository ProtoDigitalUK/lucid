import { Component, Switch, Match } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
// Assets
import notifyIllustration from "@/assets/illustrations/notify.svg";
// Service
import api from "@/services/api";
// Components
import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";
import Loading from "@/components/Partials/Loading";
import Error from "@/components/Partials/Error";

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
  const checkToken = createQuery(() => [token], {
    queryFn: () =>
      api.auth.verifyResetToken({
        token: token as string,
      }),
    retry: 0,
  });

  // ----------------------------------------
  // Render
  return (
    <Switch>
      <Match when={checkToken.isLoading}>
        <Loading type="fill" />
      </Match>
      <Match when={checkToken.isError}>
        <Error
          type={"fill"}
          content={{
            image: notifyIllustration,
            title: "The token you provided is invalid.",
            description:
              "The token you provided is invalid or expired. Please ensure you have copied the link correctly, or request a new password reset link.",
          }}
          link={{
            text: "Back to login",
            href: "/login",
          }}
        />
      </Match>
      <Match when={checkToken.isSuccess}>
        <h1 class="mb-2 text-center 3xl:text-left">Reset your password</h1>
        <p class="mb-10 text-center 3xl:text-left">
          Enter your new password below
        </p>
        <div class="mb-10">
          <ResetPasswordForm token={token as string} />
        </div>
      </Match>
    </Switch>
  );
};

export default ResetPasswordRoute;