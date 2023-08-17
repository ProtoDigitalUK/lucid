import type { Component } from "solid-js";
import T from "@/translations";
// Services
import api from "@/services/api";
// Components
import Button from "@/components/Partials/Button";

const DashboardRoute: Component = () => {
  // ----------------------------------------
  // Mutations
  const logout = api.auth.useLogout();

  // ----------------------------------------
  // Render
  return (
    <div>
      <Button
        type="submit"
        theme="primary"
        size="medium"
        loading={logout.action.isLoading}
        onClick={() => logout.action.mutate()}
      >
        {T("logout")}
      </Button>
    </div>
  );
};

export default DashboardRoute;
