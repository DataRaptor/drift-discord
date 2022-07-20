<div align="center">
  <img height="120x" src="https://uploads-ssl.webflow.com/611580035ad59b20437eb024/616f97a42f5637c4517d0193_Logo%20(1)%20(1).png" />

  <h1 style="margin-top:20px;">V1 Drift Discord</h1>
</div>

## ✨  Services live. [Check it out!](https://client-4fpiw4senq-ue.a.run.app)

## Overview

This repository contains code to link Discord accounts to Solana wallet Pubkeys for Drift users.

Click [here](https://client-4fpiw4senq-ue.a.run.app) to view the web app.

Click [here](https://api-4fpiw4senq-ue.a.run.app) to go to the deployed API.

## Services

This repo contains two services, an API and Client.

These services are ready for production. 

Documentation for each service can be found in the respective directories.

## UI/UX

The figma document with my initial designs is in the `docs` directory.

The motive for the design was to provide a intuitive, delightful and feedback rich experience for our users. 

For styling I drew inspiration from the Drift homepage. 

## Architecture


The following diagram will explain the control flow. 

<img src="https://github.com/DataRaptor/drift-discord/blob/d965a560c177f6d5e1073de473f2b7e106f056c2/docs/arch.png" width="100%" height="auto"/>

### OAuth
 
We follow the standard OAuth procedure with the caveat that we will need to sign message on the client and verify signatures on the server and client when necessary. 

### Security

Particular attention is given to security during interactions between the client and api, namely to verify that the user sending requests are who they say they are (via discord access token and Solana wallet signatures). 

Additionally, we encrypt the discord access tokens via `AES` when the tokens are handed back to the client (although query parameters are secured by SSL, it's best to not have them in the server logs).

### Signatures and Local Storage

We also make use of the client's localstorage for cache to improve the user experience as signing too many messages in the browser can be cumbersome. 

We store the lastSignature in localstorage because of the discord redirect and to serve as an argument on API requests. We revalidate the signature of the user on secure routes of the API, particularly on the `POST::discordUser` and `GET::discordUser` endpoints.

We also revalidate these signatures on the client before requests are made in the event that wallet pubkeys have changed or local storage is wiped. We rerequest signing on the client when necessary.

### DB

We use MYSQL and typeorm. Our db is currently running on a small gcp cloud-sql instance.

## CIDC 

The Client and API are built, tagged and stored in our image registry on push to the `main` branch.

Furthermore, the services will deploy to the links in the `Overview` section.

I use Google Cloud Platform because I refuse to pay for prime and have an AWS account. The services are containerized so deploy them where you want, iff you have an AWS account and those juicy serverless.yaml configs. 

## User Data Considerations

If an old user uses a new wallet and hence publickey we take the approach of storing the new wallet as a new JSON document (as opposed to rewriting the old). This will allow us to associate the same discord user to multiple publickeys.

We would like to capture as much data as we can about our users and adhere to the law. We censor data using locale to comply with GDPR. Within the `/api/config` we define a constant: 
```ts
export const GDPR_EXEMPT_LOCALES: string[] = ["en-US"]
```
of all the `locales` that we would like to collect the full payload of discord from. Locales within this list will be saved to the db with the following discord data: 
```ts
export type GDPRExemptDiscordUserData = {
      discord_id: string | null
      username: string | null
      avatar: string | null
      avatar_decoration: string | null
      discriminator: string | null
      public_flags: number | null
      flags: number | null
      banner: string | null
      banner_color: string | null
      accent_color: string | null
      locale: string | null
      mfa_enabled: boolean | null
      email: string | null
      verified: boolean | null
      is_gdpr: boolean
}
```
Users from locales outside of this list will have a reduced schema of the form: 
```ts
export type GDPRCensoredDiscordUserData = {
      discord_id: string | null
      username: string | null // We want to keep this field to display it in the UI. Showing a discord Id would be confusing to the user.
      avatar: null
      avatar_decoration:  null
      discriminator:  null
      public_flags:  null
      flags:  null
      banner:  null
      banner_color: null
      accent_color: null
      locale:  null
      mfa_enabled:  null
      email:  null
      verified: null
      is_gdpr: null
}
```

We store the following information about the user's Solana wallet: 
```ts
export type SolanaWalletData = {
      public_key: string
      signature: string
      message: string
}
```



## Testing

TODO: We have no testing on either service. Both services have to be tested before they want to hit production. Figured the point of this wasn't to see how i'd write mocha and cypress tests... 

## Miscellaneous Notes

- The final working and stable M.V.P after the 8 hours of time allocated can be found on commit hash: `3c7272f`. 

- CHORE commits after `3c7272f` are refactors of this code to improve the UI, readability, trigger builds and improve the documentation. 

- Both services could use better `types`. It would be good practice but typing everything is time expensive. 

- If it takes a while initially to load, note that both services are deployed to GCP `cloud-run` which cold starts the containers after some period of inactivity (avoids billing). 

- Since I am on the only one in this repo, I typically commit right to `main` despite the rebuilds. No branches / pull requests needed.
