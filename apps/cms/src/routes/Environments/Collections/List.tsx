import { Component } from "solid-js";
import { useParams } from "@solidjs/router";

const EnvCollectionsListRoute: Component = () => {
  const props = useParams();

  // ----------------------------------
  // Render
  return (
    <div>
      <h1>Environment Collections List: {props.collectionKey}</h1>
    </div>
  );
};

export default EnvCollectionsListRoute;
