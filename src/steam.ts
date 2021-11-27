import SpotifyWebApi from "spotify-web-api-node";
import SteamUser from "steam-user";

const client = new SteamUser({});

export const initSteam = async (username: string, password: string) => {
  client.logOn({
    accountName: username,
    password: password,
  });

  return new Promise<SteamUser>((resolve, reject) => {
    client.on("loggedOn", () => {
      console.log("Logged into Steam");
      client.setPersona(SteamUser.EPersonaState.Online);
      resolve(client);
    });

    client.on("error", (error) => {
      console.error("Failed to login to steam: ", error);
      process.exit(1);
    });
  });
};

export const updatePlayingSong = async (
  spotify: SpotifyWebApi,
  notPlaying: string
) => {
  let currentId = "";
  setInterval(async () => {
    const { body: currentlyPlaying } = await spotify.getMyCurrentPlayingTrack();
    if (currentlyPlaying.is_playing && currentlyPlaying.item) {
      const track = currentlyPlaying.item;
      const songId = track.id;
      if (songId !== currentId) {
        console.log("Now playing:", track.name);
        const { body: fullTrack } = await spotify.getTrack(track.id);
        const playing = `Listening to ${fullTrack.name} • ${fullTrack.artists
          .map(({ name }) => name)
          .join(", ")}`;
        client.gamesPlayed(playing);
        currentId = songId;
      }
    } else {
      if (currentId !== notPlaying) {
        console.log("Not playing anything");
        client.gamesPlayed(notPlaying);
        currentId = notPlaying;
      }
    }
  }, 2000);
};
