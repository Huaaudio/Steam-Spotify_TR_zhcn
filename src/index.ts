// Initialize dotenv as early as possible
import "dotenv/config";

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
    SteamUsername2,
    SteamPassword2,
    ClientId,
    ClientSecret,
    NotPlaying,
  } = initConfig();

  const spotify = await initSpotify(ClientId, ClientSecret, server);

  const clients = [await initSteam(SteamUsername, SteamPassword)];

  if (SteamUsername2 && SteamPassword2) {
    clients.push(await initSteam(SteamUsername2, SteamPassword2));
  }

  await updatePlayingSong(spotify, clients, NotPlaying);
};

server.listen(8888, () => {
  console.log("Server is running on http://localhost:8888");
});

main();
