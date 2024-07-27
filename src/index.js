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

/**
 * Record audio stream
 * @param {MediaStream} stream
 * @returns {Promise<Blob>}
 */
const record = (stream) => {
  const options = { mimeType: "audio/webm" };
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, options);

  return new Promise((resolve) => {
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", async function () {
      const blob = new Blob(recordedChunks);

      resolve(blob);
    });

    mediaRecorder.start();
  });
};

// Init Azure Blob Storage Client
const blobServiceClient = new BlobServiceClient(config.connectionString);
const containerClient = blobServiceClient.getContainerClient(
  config.containerName
);

// State
const state = {
  /** @type {MediaStream | undefined} */
  stream: undefined,
  /** @type {Promise<Blob> | undefined} */
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

  if (state.stream) {
    for (const track of state.stream.getTracks()) {
      track.stop();
    }

    const blob = await state.recorder;

    if (blob) {
      await upload(blob);
    }

    state.stream = undefined;
    state.recorder = undefined;

    return;
  }

  state.stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  state.recorder = record(state.stream);
});
