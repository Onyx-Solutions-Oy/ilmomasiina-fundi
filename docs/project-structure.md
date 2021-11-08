# Project structure

The project uses [Lerna](https://lerna.js.org/) to manage the code in separate packages. This allows for cleaner code
and package files.

To prepare for development, run `npx lerna bootstrap`.
The project is configured to run development servers for the frontend and backend with `npm start`.

## Packages

The project is divided into three packages:

- `ilmomasiina-models` contains the single source of truth for the data model and API:
    - The JS column types for DB models. These are implemented by the concrete Sequelize models.
    - The API models, derived mostly by picking columns from the DB models.
    - Utility interfaces that convert Dates in the API models to strings, for frontend typings.
- `ilmomasiina-backend` contains the backend code and depends on `ilmomasiina-models`.
  It currently also depends on `ilmomasiina-frontend` in order to serve its static files.
- `ilmomasiina-frontend` contains the frontend code, along with scripts and dependencies inherited from `npm eject`.
  It also depends on `ilmomasiina-models` but not `ilmomasiina-backend`.
- In addition, the root folder has a `package.json`, which is used for ESLint and other development dependencies
  that are shared between the packages. That package contains no code.

## Usage

To modify the app, fork the repository and modify the code to your needs. If you don't modify `ilmomasiina-models`,
your modified backend or frontend should be compatible with unmodified versions.
Don't forget to submit a PR if your code might be useful to others!

To build a new API client, import `ilmomasiina-models`.

To build a new web UI, either just import `ilmomasiina-models`, or import components from `ilmomasiina-frontend`.