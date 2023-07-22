import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
// Layouts
import AuthRoutes from "@/layouts/AuthRoutes";
import MainLayout from "@/layouts/Main";
// Guards
import Authenticated from "@/guards/Authenticated";
import AuthLocked from "@/guards/AuthLocked";
// ------------------------------------------------------
// Routes

// root
import LoginRoute from "@/routes/Login";
import ForgotPasswordRoute from "@/routes/ForgotPassword";
import ResetPasswordRoute from "@/routes/ResetPassword";
import DashboardRoute from "@/routes/Dashboard";

// environments
import EnvCollectionsListRoute from "@/routes/Environments/Collections/List";
import EnvFormsListRoute from "@/routes/Environments/Forms/List";
import EnvMenusListRoute from "@/routes/Environments/Menus/List";

const AppRouter: Component = () => {
  return (
    <Router>
      <Routes>
        {/* Authenticated only */}
        <Route path="/" component={Authenticated}>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<DashboardRoute />} />
            <Route
              path="/env/:envKey/collections"
              element={<EnvCollectionsListRoute />}
            />
            <Route path="/env/:envKey/forms" element={<EnvFormsListRoute />} />
            <Route path="/env/:envKey/menus" element={<EnvMenusListRoute />} />
          </Route>
        </Route>
        {/* Non authenticated only */}
        <Route path="/" component={AuthLocked}>
          <Route path="/" component={AuthRoutes}>
            <Route path="/login" component={LoginRoute} />
            <Route path="/forgot-password" component={ForgotPasswordRoute} />
            <Route path="/reset-password" component={ResetPasswordRoute} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
