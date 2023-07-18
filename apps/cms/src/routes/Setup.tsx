import { type Component } from "solid-js";

// Components
import RegisterSuperAdmin from "@/components/Forms/RegisterSuperAdmin";

const SetupRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <div class="">
      <h1 class="mb-2">Let's get started</h1>
      <p class="mb-10">Please register your super admin account</p>
      <div class="mb-10">
        <RegisterSuperAdmin />
      </div>
    </div>
  );
};

export default SetupRoute;
