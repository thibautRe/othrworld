# Othrworld

This monorepo contains the source code for Othrworld, a single-player game about space systems and exploration.

## Development

The repo is organised in a monorepo structure using Yarn Workspaces. The main app is located in the [`@othrworld/app`](./packages/app/) package.

To run the app, run the following commands:

```sh
yarn install
yarn start
```

This will compile all the inner dependencies, run typescript watchers and start the app on port 3000.
