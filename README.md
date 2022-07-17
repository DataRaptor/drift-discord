<div align="center">
  <img height="120x" src="https://uploads-ssl.webflow.com/611580035ad59b20437eb024/616f97a42f5637c4517d0193_Logo%20(1)%20(1).png" />

  <h1 style="margin-top:20px;">Drift Discord</h1>
</div>

## ✨  Services live. Check it out!

## Overview

This repository contains code to link Discord accounts to Solana wallet Pubkeys for Drift users.

Click [here](https://client-4fpiw4senq-ue.a.run.app) to view the web app.

Click [here](https://api-4fpiw4senq-ue.a.run.app) to go to the deployed API.

## Services

This repo contains two services, an API and Client.

Documentation for each service can be found in the respective directories. 

## UI

The figma document with my initial designs is in the `docs` directory.

The motive for the design was to provide a intuitive, delightful and feedback rich experience for our users. 

For styling I drew inspiration from the Drift homepage. 

## Architecture


The following diagram will explain the control flow. 

<img src="https://github.com/DataRaptor/drift-discord/blob/03f053ed7e80627935120648662261d060d0d88f/docs/arch.png" width="100%" height="auto"/>

We follow the standard OAuth procedure with the caveat that we will need to sign and verify signatures from the wallets both on the server and client when necessary. 

Particular attention is given to security during interactions between the client and api, namely to verify that the user sending requests are who they say they are (via discord access token and Solana wallet signatures). 

Additionally, we encrypt the discord access tokens via `AES` when the tokens are handed back to the client (although query parameters are secured by SSL, it's best to not have them in the server logs).

We also make use of the client's localstorage for cache to improve the user experience as signing too many messages in the browser can be cumbersome. 

We store the lastSignature in localstorage because of the discord redirect and to serve as an argument on API requests. We revalidate the signature of the user on secure endpoints of the API, particularly on the `POST::discordUser` and `GET::discordUser` endpoints.

We also revalidate these signatures on the client before requests are made in the event that wallet pubkeys have changed or local storage is wiped. We rerequest signing on the client when necessary.

If an old user uses a new wallet and hence publickey we take the approach of storing the new wallet as a new JSON document (as opposed to rewriting the old). This will allow us to associate the same discord user to multiple publickeys.

Since we're not doing any complex joins I thought it was sufficient to use a document store as my DB; I chose mongo. For this usecase, this is fine. We're storing a single model and not doing any complex joins.

## CIDC 

The Client and API are built, tagged and stored in our image registry on push to the `main` branch.

Furthermore, the services will deploy to the links in the `Overview` section.

## Testing

TODO: We have no testing on either service.

## Notes

- The final working and stable M.V.P after the 8 hours of time allocated can be found on commit hash: `3c7272f`. 

- CHORE commits after `3c7272f` are refactors of this code to improve the UI, readability, trigger builds and improve the documentation. 

- If it takes a while initially to load, note that both services are deployed to GCP `cloud-run` which cold starts the containers after some period of inactivity (avoids billing). 

- Since I am on the only one in this repo, I typically commit right to `main` despite the rebuilds.

- Need to add a final API call to revoke the token.

- Damian mentioned we want to store less data, need to implement that. But that's easy.

- Create a SQL instance and switch to typeorm if time permits. Get rid of 3rd party ORMs.