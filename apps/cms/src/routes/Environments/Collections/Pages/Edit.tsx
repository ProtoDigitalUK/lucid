import T from "@/translations";
import { Component, createSignal } from "solid-js";
// Components
import Form from "@/components/Groups/Form";

const EnvCollectionsPagesEditRoute: Component = () => {
  // ----------------------------------
  // States
  const [getName, setName] = createSignal<string>("");

  // ----------------------------------
  // Render
  return (
    <div class="relative h-screen w-full flex">
      {/* Inputs */}
      <div class="w-[500px] max-h-screen overflow-y-auto p-15 md:p-30">
        <h1>{T("edit_page_route_title")}</h1>
        <div class="mt-30">
          <Form.Input
            id="name"
            name="name"
            type="text"
            value={getName()}
            onChange={setName}
            copy={{
              label: T("name"),
            }}
            required={true}
          />{" "}
          <Form.Input
            id="slug"
            name="slug"
            type="text"
            value={getName()}
            onChange={setName}
            copy={{
              label: T("slug"),
            }}
            required={true}
          />
        </div>
      </div>
      {/* Build */}
      <div class="h-full w-full p-15 pl-0">
        <div class="w-full h-full bg-primary rounded-md brick-pattern overflow-hidden relative"></div>
      </div>
    </div>
  );
};

export default EnvCollectionsPagesEditRoute;
