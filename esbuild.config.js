import * as esbuild from "esbuild";

await Promise.all([
  esbuild.build({
    entryPoints: ["src/libs.js"],
    bundle: true,
    minify: true,
    format: "esm",
    outfile: "public/dist/libs.js",
  }),
  esbuild.build({
    entryPoints: ["src/config.js"],
    bundle: true,
    minify: true,
    format: "esm",
    outfile: "public/dist/config.js",
    define: {
      "process.env.AZURE_STORAGE_CONNECTION_STRING": JSON.stringify(
        process.env.AZURE_STORAGE_CONNECTION_STRING
      ),
    },
  }),
  esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: false,
    minify: false,
    format: "esm",
    outfile: "public/dist/index.js",
  }),
]);
