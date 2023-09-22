import { Component } from "solid-js";
import { useParams } from "@solidjs/router";

const EnvCollectionsSinglePageEditRoute: Component = () => {
  const props = useParams();

  // ----------------------------------
  // Render
  return (
    <div>
      <h1>Environment Collections Single Page Edit: {props.collectionKey}</h1>
    </div>
  );
};

export default EnvCollectionsSinglePageEditRoute;
