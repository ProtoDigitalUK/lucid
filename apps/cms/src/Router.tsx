import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
// Routes
import LoginRoute from "@/routes/Login";
import ForgotPasswordRoute from "@/routes/ForgotPassword";
import DashboardRoute from "@/routes/Dashboard";
// Layouts
import AuthRoutes from "@/layouts/AuthRoutes";

const AppRouter: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={DashboardRoute} />

        <Route path="/" component={AuthRoutes}>
          <Route path="/login" component={LoginRoute} />
          <Route path="/forgot-password" component={ForgotPasswordRoute} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
