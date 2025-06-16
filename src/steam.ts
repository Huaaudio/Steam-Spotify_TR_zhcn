import SpotifyWebApi from "spotify-web-api-node";
import SteamUser from "steam-user";

export const initSteam = async (username: string, password: string) => {
  const client = new SteamUser({});
  client.logOn({
    accountName: username,
    password: password,
  });

  return new Promise<SteamUser>((resolve, reject) => {
    client.on("loggedOn", () => {
      console.log(`Steam登录成功! (${username})`);
      client.setPersona(SteamUser.EPersonaState.Online);
      resolve(client);
    });

    client.on("error", (error) => {
      console.error(`登录Steam失败 (${username}) 原因: `, error);
      process.exit(1);
    });
  });
};

/**
 * Periodically updates the Steam status of multiple clients to reflect the currently playing Spotify song.
 * If no song is playing, sets a default "not playing" status.
 * 
 * @param spotify - An authenticated instance of SpotifyWebApi.
 * @param clients - An array of SteamUser clients whose status will be updated.
 * @param notPlaying - The status message to display when no song is playing.
 */
export const updatePlayingSong = async (
  spotify: SpotifyWebApi,
  clients: SteamUser[], // Accept an array of clients
  notPlaying: string
) => {
  let currentId = "";
  setInterval(async () => {
    try {
      const { body: currentlyPlaying } = await spotify.getMyCurrentPlayingTrack();
      if (currentlyPlaying.is_playing && currentlyPlaying.item) {
        const track = currentlyPlaying.item;
        const songId = track.id;
        if (songId !== currentId) {
        try {
          const { body: fullTrack } = await spotify.getTrack(track.id);
          const playing = `在听 ${fullTrack.name} • ${fullTrack.artists
            .map(({ name }) => name)
            .join(", ")}`;
          // Update all clients
          clients.forEach((client) => client.gamesPlayed(playing));
          currentId = songId;
        } catch (error) {
          console.error("获取歌曲详情失败:", error);
        }
          currentId = songId;
        }
      } else {
        if (currentId !== notPlaying) {
          console.log("目前没在播放任何歌曲");
          clients.forEach((client) => client.gamesPlayed(notPlaying));
          currentId = notPlaying;
        }
      }
    } catch (error) {
      console.error("获取当前播放歌曲时出错:", error);
      // Optionally, you can also update clients to show not playing
      clients.forEach((client) => client.gamesPlayed(notPlaying));
      currentId = notPlaying;
    }
  }, 2000);
};

// Example usage:
// const client1 = await initSteam("username1", "password1");
// const client2 = await initSteam("username2", "password2");
// updatePlayingSong(spotifyApi, [client1, client2], "未在播放音乐");
