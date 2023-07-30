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

// media
import MediaListRoute from "@/routes/Media/List";

// users
import UsersListRoute from "@/routes/Users/List";

// settings
import SettingsListRoute from "@/routes/Settings/List";

// environments
import EnvCollectionsListRoute from "@/routes/Environments/Collections/List";
import CreateEnvrionemntRoute from "@/routes/Environments/Create";
import ManageEnvrionemntRoute from "@/routes/Environments/Manage";

const AppRouter: Component = () => {
  return (
    <Router>
      <Routes>
        {/* Authenticated only */}
        <Route path="/" component={Authenticated}>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<DashboardRoute />} />
            {/* Environments */}
            <Route
              path="/env/:envKey/collection/:collectionKey"
              element={<EnvCollectionsListRoute />}
            />
            <Route path="/env/create" element={<CreateEnvrionemntRoute />} />
            <Route path="/env/:envKey" element={<ManageEnvrionemntRoute />} />
            {/* Media */}
            <Route path="/media" element={<MediaListRoute />} />
            {/* Users */}
            <Route path="/users" element={<UsersListRoute />} />
            {/* Settings */}
            <Route path="/settings" element={<SettingsListRoute />} />
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
