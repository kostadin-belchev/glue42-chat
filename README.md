# Glue42 Chat

This repository contains both apps needed for running a chat room solution built with Glue42.

## Glue42 Chat Provider app

Runs in the background and provides all necessary code for Glue42 Chat Client app to work.

## Glue42 Chat Client app
The chat client app the user opens to start chatting.

### Prerequisites

- Glue Desktop
- node
- npm

### Setup

- clone the repository
- copy the `.json` config files from the application folders (look at the configuration locations [below](#configurations-locations))
- put them in the GD application configuration folder (`%LocalAppData%\Tick42\GlueDesktop\config\apps`)
- open a terminal in the home directory of this repo
- in the terminal write `cd glue42-chat-client` then `npm install` to install all dependencies for Glue42 Chat Client app
- write `npm start` to host the Glue42 Chat Client app.
- open a new terminal in the home directory of this repo
- write `cd glue42-chat-provider` and then `npm install` to install all dependencies for Glue42 Chat Provider app
- write `npm run start` to host the Glue42 Chat Provider app.

Now you should be able to start Glue42 Chat Client app from the GD app manager, Glue42 Chat Provider app is autostart, so no need to run it manually, it will start when Glue desktop app is started.

#### Configurations locations

These are the locations of all configuration files

- `./glue42-chat-provider/glue42-chat-provider.json`
- `./glue42-chat-client/glue42-chat-client.json`

## Glue42 Chat Client app
