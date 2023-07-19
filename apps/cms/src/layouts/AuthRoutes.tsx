import { type Component, Match, Switch } from "solid-js";
import { Outlet, useLocation } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Assets
import donutLove from "@/assets/illustrations/donut-love.svg";
// Serivces
import api from "@/services/api";
// Components
import Loading from "@/components/Partials/Loading";
import Error from "@/components/Partials/Error";

const AuthRoutes: Component = () => {
  // ----------------------------------------
  // Hooks & States
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------
  // Queries / Mutations
  const checkSetupState = createQuery(
    () => ["options.getSinglePublic.initial_user_created", location.pathname],
    {
      queryFn: () =>
        api.options.getSinglePublic({
          key: "initial_user_created",
        }),
      onSettled: (data) => {
        if (!data?.data.initial_user_created) {
          navigate("/setup");
        } else {
          if (location.pathname === "/setup") {
            navigate("/login");
          }
        }
      },
    }
  );

  // ----------------------------------
  // Render
  return (
    <div class="fixed top-0 left-0 bottom-0 right-0 flex ">
      <div class="w-full 3xl:w-[40%] 3xl:min-w-[800px] h-full bg-white overflow-y-auto flex items-center justify-center relative">
        <div class="m-auto px-10 py-20 w-full max-w-[600px] ">
          <Switch>
            <Match when={checkSetupState.isLoading}>
              <Loading type="fill" />
            </Match>
            <Match when={!checkSetupState.isError}>
              <Error
                type="fill"
                content={{
                  image: donutLove,
                  title: "Something went wrong",
                  description:
                    "An unexpected error has occurred. Please try again later.",
                }}
              />
            </Match>
            <Match when={checkSetupState.isSuccess}>
              <Outlet />
            </Match>
          </Switch>
        </div>
      </div>
      <div class="hidden w-[60%] bg-primary 3xl:flex items-center justify-center text-white relative">
        <span class="absolute inset-0 flex items-center">
          <span class="block  border border-border opacity-80 w-full after:pb-[100%] after:block rotate-45 translate-x-1/2"></span>
        </span>
        <span class="absolute inset-0 flex items-center">
          <span class="block  border border-border opacity-50 w-full after:pb-[100%] after:block rotate-45 translate-x-1/3"></span>
        </span>
      </div>
    </div>
  );
};

export default AuthRoutes;
