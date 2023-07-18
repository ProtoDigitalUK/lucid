import { type Component, Match, Switch } from "solid-js";
import { Outlet, useLocation } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Serivces
import api from "@/services/api";
// Components
import Loading from "@/components/Partials/Loading";

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
      onSuccess: (data) => {
        if (
          typeof data.data.option_value === "boolean" &&
          data.data.option_value === false
        ) {
          navigate("/setup");
        } else {
          if (location.pathname === "/setup") {
            navigate("/login");
          }
        }
      },
      cacheTime: 0,
    }
  );

  // ----------------------------------
  // Render
  return (
    <div class="fixed top-0 left-0 bottom-0 right-0 flex">
      <div class="w-full 3xl:w-[40%] 3xl:min-w-[800px] h-full bg-white overflow-y-auto flex items-center justify-center">
        <div class="m-auto px-10 py-20 w-full max-w-[600px]">
          <Switch>
            <Match when={checkSetupState.isLoading}>
              <Loading type="fill" />
            </Match>
            <Match when={checkSetupState.isError}>
              <p>Error: error</p>
            </Match>
            <Match when={checkSetupState.isSuccess}>
              <Outlet />
            </Match>
          </Switch>
        </div>
      </div>
      <div class="hidden 3xl:block w-[60%] bg-primary"></div>
    </div>
  );
};

export default AuthRoutes;
