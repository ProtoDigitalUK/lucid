import { Component } from "solid-js";
import { useParams } from "@solidjs/router";

const EnvCollectionsSingleRoute: Component = () => {
  const props = useParams();

  // ----------------------------------
  // Render
  return (
    <div>
      <h1>Environment Collections Single: {props.collectionKey}</h1>
    </div>
  );
};

export default EnvCollectionsSingleRoute;
