// Initialize dotenv as early as possible
require("dotenv").config();

import express from "express";

import { initConfig } from "./config";
import { initSteam, updatePlayingSong } from "./steam";
import { initSpotify } from "./spotify";

const server = express();

const main = async () => {
  // Update your config to provide two sets of credentials
  const {
    SteamUsername,
    SteamPassword,
    SteamUsername2,    // Add second account
    SteamPassword2,    // Add second account
    ClientId,
    ClientSecret,
    NotPlaying,
  } = initConfig();

  const spotify = await initSpotify(ClientId, ClientSecret, server);

  // Initialize both Steam accounts
  const client1 = await initSteam(SteamUsername, SteamPassword);
  const client2 = await initSteam(SteamUsername2, SteamPassword2);

  // Pass both clients to updatePlayingSong
  await updatePlayingSong(spotify, [client1, client2], NotPlaying);
};

server.listen(8888, () => {});

main();
