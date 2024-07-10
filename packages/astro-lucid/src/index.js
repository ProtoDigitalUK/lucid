import fastify from "@matthewp/astro-fastify";

const astroLucid = () =>
  fastify({
    entry: new URL("./start-lucid.js", import.meta.url),
  });

export default astroLucid;
