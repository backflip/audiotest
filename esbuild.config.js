import * as esbuild from "esbuild";

await Promise.all([
  esbuild.build({
    entryPoints: ["src/libs.js"],
    bundle: true,
    minify: true,
    format: "esm",
    outfile: "dist/libs.js",
  }),
  esbuild.build({
    entryPoints: ["src/config.js"],
    bundle: true,
    minify: true,
    format: "esm",
    outfile: "dist/config.js",
    define: {
      "process.env.AZURE_STORAGE_CONNECTION_STRING": JSON.stringify(
        process.env.AZURE_STORAGE_CONNECTION_STRING
      ),
    },
  }),
]);
