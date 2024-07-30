# Record user audio and upload to Azure

## Setup

### Prerequisites

- We need an Azure storage connection string provided as an environment variable. `cp .env.template .env` and insert connection string (following [this quickstart](https://learn.microsoft.com/en-us/azure/storage/blobs/quickstart-blobs-javascript-browser#configure-storage-account-for-browser-access)).
- For Safari to be able to capture audio locally, we need to serve the page via https. To do this, we need to create `./cert/cert.pem` and `./cert/key.pem`, e.g. via [mkcert](https://github.com/FiloSottile/mkcert).

### Installation

- `npm ci` (using the Node.js version specified in [.nvmrc](./.nvmrc))

### Build JavaScript files

- `npm run build`

### Serve

- `npm start:https`
