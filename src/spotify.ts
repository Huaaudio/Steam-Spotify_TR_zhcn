import SpotifyWebApi from "spotify-web-api-node";
import { Express } from "express";
import { config } from "./config";

const initSpotify = async (
  clientId: string,
  clientSecret: string,
  server: Express
) => {
  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri: "http://localhost:8888/callback",
  });

  let tokenRefreshInterval: NodeJS.Timeout;

  const access_token = config.get("access_token") as string;
  const refresh_token = config.get("refresh_token") as string;
  const expires_in = config.get("expires_in") as number;

  if (access_token && refresh_token && expires_in) {
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    tokenRefreshInterval = setInterval(async () => {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body["access_token"];

      console.log("授权令牌已刷新!");
      console.log("授权令牌:", access_token);
      spotifyApi.setAccessToken(access_token);
    }, (expires_in / 2) * 1000);
  }

  server.get("/login", (req, res) => {
    const scopes = ["user-read-currently-playing", "user-read-playback-state"];
    res.redirect(spotifyApi.createAuthorizeURL(scopes, "state"));
  });

  // Add new endpoint for reauthentication
  server.get("/reauth", (req, res) => {
    // Clear existing tokens from config
    config.set("access_token", null);
    config.set("refresh_token", null);
    config.set("expires_in", null);
    
    // Clear refresh interval if it exists
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval);
    }
    
    // Clear tokens from Spotify API
    spotifyApi.setAccessToken("");
    spotifyApi.setRefreshToken("");
    
    console.log("Spotify 授权已重置，重定向到登录页面...");
    
    // Redirect to login page
    res.redirect("/login");
  });

  server.get("/callback", async (req, res) => {
    const error = req.query.error;
    const code = req.query.code as string;

    if (error) {
      console.error("回调参数获取失败:", error);
      process.exit(1);
    }

    const codeGrant = await spotifyApi.authorizationCodeGrant(code);
    const access_token = codeGrant.body["access_token"];
    const refresh_token = codeGrant.body["refresh_token"];
    const expires_in = codeGrant.body["expires_in"];

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    config.set("access_token", access_token);
    config.set("refresh_token", refresh_token);
    config.set("expires_in", expires_in);

    res.send("成功读取API配置,现在请关闭此页面.");

    tokenRefreshInterval = setInterval(async () => {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body["access_token"];

      console.log("授权令牌已刷新!");
      console.log("授权令牌::", access_token);
      spotifyApi.setAccessToken(access_token);
    }, (expires_in / 2) * 1000);
  });

  if (!spotifyApi.getAccessToken()) {
    console.log(
      "请在浏览器中登录Spotify - http://localhost:8888/login"
    );
  }

  while (!spotifyApi.getAccessToken()) {
    console.log("等待登录Spotify中...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log("成功连接到Spotify API!");

  return spotifyApi;
};

export { initSpotify };
