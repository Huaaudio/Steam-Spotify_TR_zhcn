import Conf from "conf";

export const config = new Conf({});

const ClientId = process.env.CLIENTID;
const ClientSecret = process.env.CLIENTSECRET;
const SteamUsername = process.env.STEAMUSERNAME;
const SteamPassword = process.env.STEAMPASSWORD;
const NotPlaying = process.env.NOTPLAYING || "Monkey";

export const initConfig = () => {
  if (!ClientId || !ClientSecret || !SteamUsername || !SteamPassword) {
    console.error("配置参数错误: ", {
      ClientId,
      ClientSecret,
      SteamUsername,
      SteamPassword,
    });
    process.exit(1);
  }
  console.log("参数载入成功");
  return {
    ClientId,
    ClientSecret,
    SteamUsername,
    SteamPassword,
    NotPlaying,
  };
};
