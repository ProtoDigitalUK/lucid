import type { Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
// Routes
import LoginRoute from "@/routes/Login";
import DashboardRoute from "@/routes/Dashboard";

const AppRouter: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={DashboardRoute} />
        <Route path="/login" component={LoginRoute} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
