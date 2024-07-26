// @ts-check
import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = new BlobServiceClient(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerName = `container${new Date().getTime()}`;
const containerClient = blobServiceClient.getContainerClient(containerName);

const toggleButton = document.querySelector("button");
let stream;

const handleSuccess = function (stream) {
  const options = { mimeType: "audio/webm" };
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.addEventListener("dataavailable", function (e) {
    if (e.data.size > 0) recordedChunks.push(e.data);
  });

  mediaRecorder.addEventListener("stop", async function () {
    const blob = new Blob(recordedChunks);

    console.log({ blob });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "test.wav";
    downloadLink.innerText = "Download";

    document.body.appendChild(downloadLink);

    const blockBlobClient = containerClient.getBlockBlobClient("test.wav");

    await containerClient.create();
    await blockBlobClient.uploadData(blob);
  });

  mediaRecorder.start();

  return stream;
};

toggleButton?.addEventListener("click", async function () {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = undefined;

    return;
  }

  stream = await navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
});

export {};
