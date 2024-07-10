import { lucidPlugin } from "@lucidcms/core";

const defineRoutes = async (fastify) => {
  await fastify.register(lucidPlugin);
};

export default defineRoutes;
