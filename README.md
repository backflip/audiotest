# Record user audio and upload to Azure

## Setup

### Prerequisites

- Set up Azure Blob Storage by following [this quickstart](https://learn.microsoft.com/en-us/azure/storage/blobs/quickstart-blobs-javascript-browser#configure-storage-account-for-browser-access).
- The build steps expects environment variables for things like the Azure Storage Connection string. Make sure to expose the variables specified in `.env.template`. The local setup expects a `.env` file with the relevant variables.
- For Safari to be able to capture audio locally, we need to serve the page via https. To do this locally, we need to create `./cert/cert.pem` and `./cert/key.pem`, e.g. via [mkcert](https://github.com/FiloSottile/mkcert).

### Installation

- `npm ci` (using the Node.js version specified in [.nvmrc](./.nvmrc))

### Build JavaScript files

- `npm run build`
- Locally: `npm run build:local` (using `.env`)

### Serve

`./public` contains everything we need.

- `npm run start`
- Locally: `npm start:local` (using files in `./cert`)
