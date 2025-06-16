import Conf from "conf";

export const config = new Conf({});

const ClientId = process.env.CLIENTID;
const ClientSecret = process.env.CLIENTSECRET;
const SteamUsername = process.env.STEAMUSERNAME;
const SteamUsername2 = process.env.STEAMUSERNAME2;
const SteamPassword = process.env.STEAMPASSWORD;
const SteamPassword2 = process.env.STEAMPASSWORD2;
const NotPlaying = process.env.NOTPLAYING || "Monkey";
const NotPlaying2 = process.env.NOTPLAYING2 || "Monkey";

export const initConfig = () => {
  if (!ClientId || !ClientSecret || !SteamUsername || !SteamPassword) {
    console.error("配置参数错误: ", {
      ClientId,
      ClientSecret,
      SteamUsername,
      SteamUsername2,
      SteamPassword,
      SteamPassword2,
    });
    process.exit(1);
  }
  console.log("参数载入成功");
  return {
    ClientId,
    ClientSecret,
    SteamUsername,
    SteamUsername2,
    SteamPassword,
    SteamPassword2,
    NotPlaying,
    NotPlaying2,
  };
};
