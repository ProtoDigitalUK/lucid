import { type Component } from "solid-js";

// Components
import RegisterSuperAdmin from "@/components/Forms/RegisterSuperAdmin";

const SetupRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <div class="">
      <h1 class="mb-2 text-center 3xl:text-left">Let's get started</h1>
      <p class="mb-10 text-center 3xl:text-left">
        Please register your super admin account
      </p>
      <div class="mb-10">
        <RegisterSuperAdmin />
      </div>
    </div>
  );
};

export default SetupRoute;
