// @ts-check
import { BlobServiceClient } from "./libs.js";
import { config } from "./config.js";

/**
 * Upload to Azure Blob Storage
 * @param {Blob} blob
 * @returns {Promise<void>}
 */
const upload = async (blob) => {
  const fileName = `${new Date().getTime()}.wav`;
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  if (status) {
    status.innerHTML = `Uploading ${fileName}...`;
  }

  await blockBlobClient.uploadData(blob);

  if (status) {
    status.innerHTML = `Uploaded ${fileName}.`;
  }
};

// Init Azure Blob Storage Client
const blobServiceClient = new BlobServiceClient(config.connectionString);
const containerClient = blobServiceClient.getContainerClient(
  config.containerName
);

// State
const state = {
  /** @type {MediaRecorder| undefined} */
  recorder: undefined,
};

// Find DOM elements
const status = document.querySelector("[data-status]");
const toggleButton = document.querySelector("[data-toggle]");

toggleButton?.addEventListener("click", async () => {
  toggleButton.setAttribute(
    "aria-pressed",
    toggleButton.getAttribute("aria-pressed") === "true" ? "false" : "true"
  );

  if (status) {
    status.innerHTML = "";
  }

  if (state.recorder) {
    state.recorder.stop();

    for (const track of state.recorder.stream.getTracks()) {
      track.stop();
    }

    state.recorder = undefined;

    return;
  }

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      const recordedChunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      });

      recorder.addEventListener("stop", async function () {
        const blob = new Blob(recordedChunks);

        upload(blob);
      });

      recorder.start();

      state.recorder = recorder;
    });
});
