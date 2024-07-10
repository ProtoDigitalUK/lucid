import { defineConfig } from "astro/config";
import astroLucid from "@lucidcms/astro-lucid";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: astroLucid(),
});
