import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
// Routes
import LoginRoute from "@/routes/Login";
import ForgotPasswordRoute from "@/routes/ForgotPassword";
import DashboardRoute from "@/routes/Dashboard";
// Layouts
import AuthRoutes from "@/layouts/AuthRoutes";
// Guards
import Authenticated from "@/guards/Authenticated";
import AuthLocked from "@/guards/AuthLocked";

const AppRouter: Component = () => {
  return (
    <Router>
      <Routes>
        {/* Authenticated only */}
        <Route path="/" component={Authenticated}>
          <Route path="/" element={<DashboardRoute />} />
        </Route>
        {/* Non authenticated only */}
        <Route path="/" component={AuthLocked}>
          <Route path="/" component={AuthRoutes}>
            <Route path="/login" component={LoginRoute} />
            <Route path="/forgot-password" component={ForgotPasswordRoute} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
