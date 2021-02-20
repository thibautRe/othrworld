# Othrworld

This monorepo contains the source code for Othrworld, a single-player game about space systems and exploration.

[![Netlify Status](https://api.netlify.com/api/v1/badges/d3cbae9b-9440-40ca-8354-4fe2d97240ea/deploy-status)](https://app.netlify.com/sites/othrworld-master/deploys)

## Development

The repo is organised in a monorepo structure using Yarn Workspaces. The main app is located in the [`@othrworld/app`](./packages/app/) package.

To run the app, run the following commands:

```sh
yarn install
yarn start
```

This will compile all the inner dependencies, run typescript watchers and start the app on port 3000.
