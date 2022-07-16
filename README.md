<div align="center">
  <img height="120x" src="https://uploads-ssl.webflow.com/611580035ad59b20437eb024/616f97a42f5637c4517d0193_Logo%20(1)%20(1).png" />

  <h1 style="margin-top:20px;">Drift Discord</h1>
</div>

# Drift Discord

This repository contains the code to link Discord accounts to Solana wallet Pubkeys. It contains two services, an API and Client.

The final working prototype after the 8 hours of time allocated to doing this task can be found on commit hash: `3c7272f`

# API

## Db
Mongodb since configuring a cloud sql instance and proxying in would have taken too much time

## Configuration

The following in an example `.env` file that you must place in the top level of the `api` directory.

```
PORT=8080
MONGO_CONN_STRING="mongodb+srv://[...REDACTED]"
DISCORD_CLIENT_ID="[REDACTED]"
DISCORD_SECRET="[REDACTED]"
DISCORD_REDIRECT_URI="http://localhost:8080/v1/discord_redirect"
DRIFT_MESSAGE="Welcome to Drift Discord!"
```

## Deployment

`gcloud builds submit`

# Client

## Configuration

The client configuration requires no secrets. Ideally, this should also go in it's own `.env` file.

```
export const DISCORD_GENERATED_URL: string = ''
export const DRIFT_MESSAGE: string = "Welcome to Drift Discord!"
```

You may generate a `DISCORD_GENERATED_URL` from the oauth admin console of Discord after specifying permissions. 

## Deployment

`gcloud builds submit`

# Docs

A basic figma wireframe of the design can be found in the `docs` directory.

# Gottchas

 - The `DRIFT_MESSAGE` in both the `api` and `client` must be set to the same message for signature verification to work.
 - When the api hands back the accessToken to the client it does so by redirect with a query parameter. This is safe because 
   urls are SSL encrypts this traffic

# TODOs

- Create `controllers` for the routes to get rid of try-catch / if-else hell.
- Clean up the frontend code some more.
- Add a token revoke on the url to cleanup
