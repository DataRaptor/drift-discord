<div align="center">
  <img height="120x" src="https://uploads-ssl.webflow.com/611580035ad59b20437eb024/616f97a42f5637c4517d0193_Logo%20(1)%20(1).png" />

  <h1 style="margin-top:20px;">Drift Discord</h1>
</div>

# WIP: Come back later :) 

# Drift Discord

This repository contains the code to link Discord accounts to Solana wallet Pubkeys. 

Click [here](https://client-4fpiw4senq-ue.a.run.app) to view the web app.

Click [here]() to go to the deployed API.

## Services

This repo contains two services, an API and Client.

Documentation for each can be found in the respective directories. 


## Architecture

We follow the standard OAuth procedure with the caveat that we will need to sign and verify signatures from the wallets both on the server. 

<img height="120x" src="https://github.com/DataRaptor/drift-discord/blob/03f053ed7e80627935120648662261d060d0d88f/docs/arch.png" />



## Notes

- The final working and stable prototype after the 8 hours of time allocated can be found on commit hash: `3c7272f`. 

- Subsequent commits are refactors of this code to improve the UI, readability, trigger builds and improve the documentation. 

- If it takes a while initially to load, note that both services are deployed to GCP `cloud-run` which cold starts the containers after some period of inactivity (avoids billing). 

