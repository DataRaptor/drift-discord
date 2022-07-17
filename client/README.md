# 🎨 Client

## Overview 

This is a React/NextJs web app for linking Drift user's discord account with their Solana Wallet.

The application is deployed here: `<INSERT_LINK>`

## Configuration

In your `next.config.js` specify the `API_URL` of the `api` service located in the top level of this repo. 

The client requires no other configuration to run. Configuration for `DISCORD_REDIRECT_URL`'s and `DRIFT_MESSAGE`'s which wallets will sign is retrieved from the server on mount of the `/components/socials-component` element.

## Installation

To install node_modules run:

    yarn run install

## Development

To start the development server run: 

    yarn run dev

## Build

To create a production build of the service run: 

    yarn run build

To start the production build run:

    yarn run start

## Deployment

The code on the `main` branch is deployed to GCP cloud-run. Configuration files can be found in the `/gcp` directory on the top level of the repo.

## TODO

- Continue to factor out more components until
- Factor out some of the more complex logic in the `socials-component`
- Use tailwind css for styling. What we have works fine but if we want to add more to this webapp, we should put our styles in a css framework. 