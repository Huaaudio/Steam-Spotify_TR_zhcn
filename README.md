<h1 align="center">Steam Spotify V2</h1>

<p>把 Steam 游戏状态改为同步 Spotify 播放歌曲名</p>

<!-- <img src="https://github.com/HuxleyMc/Steam-Spotify/blob/master/screenshot.PNG" width="300px"> -->

### 安装

`git clone https://github.com/HuxleyMc/Steam-Spotify`

中文为  

`git clone https://github.com/c6161039/Steam-Spotify_TR_zhcn`

或者直接下载[EN](https://github.com/HuxleyMc/Steam-Spotify/archive/master.zip)  [ZHCN](https://github.com/c6161039/Steam-Spotify_TR_zhcn/archive/master.zip)

解压进入目录后，使用 
```
npm install 
```
来安装依赖

### 使用方法

- 在 [Spotify 开发者面板](https://developer.spotify.com/dashboard/) 创建一个 Spotify App 来获取客户端ID以及密钥，Redirect URIs是http://127.0.0.1:8888/callback
- 打开 Example.env 并添加以下内容
- - 添加您 Steam 的用户名和密码
- - 添加您 Spotify App 的客户端ID和客户端密钥
- 最后把 Example.env 重命名为 .env

<br/>

### 运行项目

使用以下命令运行

```
1. npm run build
2. npm run start
```
并按照提示进行 Spotify 认证以及 Steam 2FA (如果有的话)

<br/>

### 开发者模式

运行开发模式
提示: 在 docker 环境下 无法正常运行

```
npm run dev
```

<br/>

## 作者

- **Huxley** - [huxleymc](https://github.com/huxleymc)

关于此项目的 [其他贡献者](https://github.com/HuxleyMc/Steam-Spotify/contributors) .
