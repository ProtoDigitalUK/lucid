/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Routes, Route } from "@solidjs/router";

import "./index.css";

//  Routes
import LoginRoute from "./routes/Login";
import DashboardRoute from "./routes/Dashboard";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={DashboardRoute} />
        <Route path="/login" component={LoginRoute} />
      </Routes>
    </Router>
  ),
  root!
);
