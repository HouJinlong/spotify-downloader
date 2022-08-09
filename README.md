# spotify-downloader

背景：很方便的下载spotify音乐和歌词文件

核心：使用[spotDL](https://github.com/spotDL/spotify-downloader) 解析 spotify 基础信息，然后 去youtube 查找视频，FFmpeg 处理出音频

使用：
1. 部署 服务器脚本
2. 替换【自己的服务】
3. [参考脚本使用](./spotify%E8%84%9A%E6%9C%AC%E4%BD%BF%E7%94%A8.md)

## 文件说明

```
node 服务器脚本调用 spotDL
    error 错误文件夹
    output 下载后音频存放文件夹
    index.mjs 脚本文件夹 提供 音频静态服务，下载接口，下载状态获取接口
    package.json 依赖
    pm2.config.js 配置
UserScript.js 油猴子脚本
```

## 问题
### 腾讯云服务器翻墙

#### v2raya

> 使用[v2raya](https://v2raya.org/docs/prologue/installation/debian/)解决

1. 导入节点，选择 启动 https://v2raya.org/docs/prologue/quick-start/

2. 设置代理所有流量

#### ShellClash

> 旧vpn过期新vpn bywa不支持v2raya改用 https://github.com/juewuy/ShellClash

### FFmpeg安装4.2+(这步可跳过，之间使用下载的FFmpeg就行)

https://www.likecs.com/show-204371530.html

Your FFmpeg installation is too old (3.4), please update to 4.2+

### spotify-downloader 调用 FFmpeg 报错

https://github.com/spotDL/spotify-downloader/issues/1324#issuecomment-868327581

解决办法，[下载指定FFmpeg](https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz)

https://github.com/spotDL/spotify-downloader#to-use-ffmpeg-binary-that-is-not-on-path-run 

### https网站内发送http不安全

This request has been blocked; the content must be served over HTTPS.

![https://cdn.nlark.com/yuque/0/2022/png/1347081/1648041049275-19b1094f-185e-4173-8795-c691063907af.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648041049275-19b1094f-185e-4173-8795-c691063907af.png)

![https://cdn.nlark.com/yuque/0/2022/png/1347081/1648041088818-4f44c175-52b8-4950-829c-a63da15489a9.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648041088818-4f44c175-52b8-4950-829c-a63da15489a9.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

![https://cdn.nlark.com/yuque/0/2022/png/1347081/1648041062583-5cab30c1-6bf1-4bd6-89c8-53a332e33c37.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648041062583-5cab30c1-6bf1-4bd6-89c8-53a332e33c37.png)







