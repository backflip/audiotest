import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "dist/index.js",
  define: {
    "process.env.AZURE_STORAGE_CONNECTION_STRING": JSON.stringify(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    ),
  },
});
