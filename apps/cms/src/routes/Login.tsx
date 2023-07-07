import type { Component } from "solid-js";
import { Link } from "@solidjs/router";

const LoginRoute: Component = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <Link href="/">Dashboard</Link>
    </div>
  );
};

export default LoginRoute;
