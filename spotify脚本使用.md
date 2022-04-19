<a name="Q4weQ"></a>
### 1.安装chrome 扩展
[https://www.tampermonkey.net/](https://www.tampermonkey.net/)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1647238975856-d176a3fb-f1f1-494b-89b8-490826691a29.png#clientId=uba873986-80ea-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=186&id=ubec4a6e3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=372&originWidth=726&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30201&status=done&style=none&taskId=ufeb488b8-12e2-4c2b-bcce-24c24f2abfb&title=&width=363)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1647238989713-a41317c1-af92-44aa-981d-f5b8f090099b.png#clientId=uba873986-80ea-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=488&id=ub6479f70&margin=%5Bobject%20Object%5D&name=image.png&originHeight=976&originWidth=2436&originalType=binary&ratio=1&rotation=0&showTitle=false&size=136378&status=done&style=none&taskId=u1529cd21-f615-4a3f-af8e-76c94f8fbc4&title=&width=1218)
<a name="oQmA6"></a>
### 2.把扩展常驻出来
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1647239046894-04768a79-da5f-4a3c-a184-b41219719a72.png#clientId=uba873986-80ea-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=388&id=uf3f88604&margin=%5Bobject%20Object%5D&name=image.png&originHeight=776&originWidth=922&originalType=binary&ratio=1&rotation=0&showTitle=false&size=152108&status=done&style=none&taskId=ucfa0b366-18b3-4b20-aeb9-3f2768850f9&title=&width=461)
<a name="G4tf6"></a>
### 3.添加脚本
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1647239080753-fe778d41-3c99-4a99-814b-1bebf6727f92.png#clientId=uba873986-80ea-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=373&id=uc9e495e5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=746&originWidth=916&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74711&status=done&style=none&taskId=u0095595f-f379-4b4a-ba5f-a1c37252eb4&title=&width=458)<br />把下面内容粘贴进去，然后保存
```javascript
// ==UserScript==
// @name         spotify脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hiya下载spotify歌曲和文件脚本
// @author       You
// @match        https://open.spotify.com/track/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    var oldFetchfn = fetch;
    let id;
    function formatTime2HMSMs(time){
        const millisecond = parseInt(time%1000)
        let second = 0;
        let totalMinute = 0;
        let minute = 0;
        let result = "";
        const totalSecond = parseInt(time/1000)
        if(totalSecond>59){
            second =  parseInt(totalSecond%60)
            totalMinute =  parseInt(totalSecond/60)
        }else{
            second = totalSecond
        }
        if(totalMinute>59){
            minute = parseInt(totalMinute%60)
        }else{
            minute =  totalMinute
        }
        if(minute<10){
            result+="0"+minute;
        }else{
            result+=""+minute;
        }
        if(second<10){
            result+=":0"+second;
        }else{
            result+=":"+second;
        }
        if(millisecond<10){
            result+=".00"+millisecond;
        }else if(millisecond<100){
            result+=".0"+millisecond;
        }else{
            result+="."+millisecond;
        }
        return result;
    }

    function download(href, title) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('download', title);
        a.click();
    }
    function Init({name,id}){
        const box = document.createElement('div')
        box.style.display="block"
        box.innerHTML =` <style>
            .hiya{
                position: fixed;right: 10px;top: 30px;opacity: .9; width: 300px;background: #fff;padding: 10px; border-radius: 2px;
                color: #000;
            }
            .hiya-title{
                font-size: 20px;margin-bottom: 5px;
            }
            .hiya textarea{
                width: 100%;
                box-sizing: border-box;
            }
            .hiya-lrc-btn{
                text-align: center;
                color:green;
                cursor: pointer;
            }
        </style>
        <div class="hiya">
            <div class="hiya-title">歌曲 ${name}</div>
            <div class="hiya-song">
                正在获取歌曲中...
            </div>
            <div class="hiya-title">歌词</div>
            <div class="hiya-lrc">
                暂未爬取到歌词，请先播放当前歌曲， 再点击，下方控制台 <svg role="img" height="16" width="16" viewBox="0 0 16 16" class="Svg-sc-1bi12j5-0 hDgDGI"><path d="M13.426 2.574a2.831 2.831 0 00-4.797 1.55l3.247 3.247a2.831 2.831 0 001.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 004.74 9.075L2.065 12.12a1.287 1.287 0 001.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 114.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 01-3.933-3.933l2.676-3.045 3.505-3.99z"></path></svg> ，若无该按钮 代表该歌曲无歌词
            </div>
        </div>`
        document.body.appendChild(box)
        // 获取音乐
        const err = ()=>{
            document.querySelector('.hiya-song').innerHTML='获取失败'
        }
        const getStatus = ()=>{
            return fetch('【自己的服务】/spotify/status?id='+id).then(v=>{
                return  v.json().then(res=>{
                        if(res.status===1){
                            console.log(new Date());
                            document.querySelector('.hiya-song').innerHTML=` <a href="${res.url}" style="color: red;word-break: break-all;" >${res.url}</a>`
                        }else if(res.status===-1){
                            err()
                        }else{
                            setTimeout(() => {
                                getStatus()
                            }, 500);
                        }
                    })
                }).catch(v=>{
                    err()
                })
        }
        console.log(new Date());
        fetch('【自己的服务】/spotify/start?id='+id).then(v=>{
            return getStatus()
        }).catch(v=>{
            err()
        })
    }
    function InitLrc(content){
        document.querySelector('.hiya-lrc').innerHTML = `<textarea  cols="30" rows="5">${content}</textarea><div class="hiya-lrc-btn">下载歌词</div>`
        setTimeout(() => {
            document.querySelector('.hiya-lrc-btn').addEventListener('click',()=>{
                const blob = new Blob([content]);
                const href = URL.createObjectURL(blob);
                download(href, id+'.lrc');
            })
        }, 100);
    }
    window.fetch = async function(input, opts){
        if(input.indexOf(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=getTrack`)!==-1){
            if(!id){
                oldFetchfn(input, opts).then(v=>{
                    v.json().then(res=>{
                        Init({
                          name:res.data.trackUnion.name,
                          id:res.data.trackUnion.id
                        })
                        id = res.data.trackUnion.id
                    })
                })
            }
        }
        // 拦截到该歌曲带时间的歌词请求
        if(id&&input.indexOf(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${id}`)!==-1){
            oldFetchfn(input, opts).then(v=>{
                v.json().then(res=>{
                    const lyrics = res.lyrics.lines.map(v=>{
                        return `[${formatTime2HMSMs(v.startTimeMs)}]${v.words}`
                    })
                    InitLrc(lyrics.join('\n'))
                })
            })
        }
        return await oldFetchfn(input, opts)
    }
})();
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091163736-a6344f2e-99c7-4884-9d3a-effa7ce0b2cf.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=535&id=uc5435a85&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1070&originWidth=1962&originalType=binary&ratio=1&rotation=0&showTitle=false&size=249006&status=done&style=none&taskId=u5ace9b32-d0b6-4066-80a4-36067d0eee7&title=&width=981)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091185977-e4c818cc-4529-4ad6-8c93-dfbbd1270bce.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=226&id=u4ed1815e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=452&originWidth=2832&originalType=binary&ratio=1&rotation=0&showTitle=false&size=119968&status=done&style=none&taskId=u804536ac-29dd-4adc-a316-c4c997ccdec&title=&width=1416)这样就代表好了
<a name="Oyg9j"></a>
### 4.使用
打开 [https://open.spotify.com/](https://open.spotify.com/) 并登陆<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091242998-65f8e4e7-0647-4f74-bfd4-f85696942bef.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=275&id=u35947536&margin=%5Bobject%20Object%5D&name=image.png&originHeight=550&originWidth=967&originalType=binary&ratio=1&rotation=0&showTitle=false&size=183163&status=done&style=none&taskId=u99cd9350-9ecc-458d-8d64-cf55b1c4c38&title=&width=483.5)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091296470-c4955647-6981-4ef7-8572-0f018b5090dd.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=829&id=ufe99d5a1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1657&originWidth=974&originalType=binary&ratio=1&rotation=0&showTitle=false&size=180908&status=done&style=none&taskId=u8bee5ff7-250e-4b5d-88c5-e07748fd289&title=&width=487)<br />回到 [https://open.spotify.com/](https://open.spotify.com/)  刷新确认变为不安全<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091353161-59d9fa9b-ddc6-441c-bfbf-bea2b6729e72.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=28&id=u3a5032c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=56&originWidth=351&originalType=binary&ratio=1&rotation=0&showTitle=false&size=9469&status=done&style=none&taskId=u59302c23-b252-478f-8cf0-5f0044d3d47&title=&width=175.5)
<a name="UUnkx"></a>
#### 开始爬歌
找到自己想爬的歌，复制分享链接<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091386816-7ed545ec-9ed4-4257-a34b-2a144fe6a8c0.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=581&id=u55f63f7f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1162&originWidth=943&originalType=binary&ratio=1&rotation=0&showTitle=false&size=472012&status=done&style=none&taskId=u18b93da3-3fcc-48d8-9c45-485d40f5f13&title=&width=471.5)<br />在一个新标签打开<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091469584-9c299ab3-a965-4099-a0e3-81248d782e51.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=716&id=u10b75670&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1432&originWidth=2844&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1638893&status=done&style=none&taskId=u9314b442-36bd-47c8-9e05-a0f8238049c&title=&width=1422)<br />发现 刚才插件 有个1 的小标，同时页面多了一块白色区域，代表插件已经生效，在开始爬歌曲了，等一会 如果成功了 爬取的 歌曲文件地址就会展示出来<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091541143-3998990e-291e-462a-826e-ceb6c230eb97.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=243&id=uc330d54c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=486&originWidth=726&originalType=binary&ratio=1&rotation=0&showTitle=false&size=167836&status=done&style=none&taskId=ubaef8d0b-5ac7-46aa-9dd2-e6259b86a4f&title=&width=363)<br />点击它在新页面打开，等加载完成后，进行试听，点三个小点，会弹出 可以下载的按钮，点下载就能下载到本地<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091571450-370a7912-b707-434c-9554-f844fb996e85.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=667&id=u932a5178&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1334&originWidth=1840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=80667&status=done&style=none&taskId=u9f299b93-a2c8-4040-bfa6-f38211ab692&title=&width=920)
<a name="JLUkj"></a>
#### 歌词
再次打开刚才的页面 <br />先进行播放，不播放无法抓取到带时间的歌词<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091666055-49ddd35f-a846-42ca-a6b7-844f588a6526.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=736&id=u24728cde&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1472&originWidth=2816&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1719857&status=done&style=none&taskId=uebb4eb9f-3857-47bc-81a6-4e17649ec18&title=&width=1408)<br />然后根据提示点话筒<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091717072-6b41650d-0719-4707-9624-55f52e2e5dba.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=727&id=u4759463f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1454&originWidth=2824&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1754585&status=done&style=none&taskId=ue2dfd0c7-490c-47eb-bf60-405a7517604&title=&width=1412)<br />然后白色框歌词曲变了<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091756982-1bdb2f8e-d8c4-469a-ac45-7602d8c10726.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=361&id=uc5f5f5f7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=722&originWidth=1132&originalType=binary&ratio=1&rotation=0&showTitle=false&size=84486&status=done&style=none&taskId=u5a7b3cd2-e716-4e83-a2d3-edd884eeaee&title=&width=566)<br />变成歌词预览框和下载，点下载 一个歌词文件就会下载下来<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091779645-753eef4b-2aa6-4779-b1b7-cd72e2c30f2b.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=78&id=u1785ddd8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=156&originWidth=572&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14358&status=done&style=none&taskId=u671961bf-ac59-43e2-a4ba-70392c085c4&title=&width=286)
<a name="nLWwM"></a>
### 5. 关闭
不想用了，点前面的小开关 关闭，重新刷新页面，就回到原来的样子了，想用的时候，点开，再刷新一下页面又会出来<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091939144-319d21f2-2c4d-4ae1-890d-bc5c962555a2.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=510&id=uade8e323&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1020&originWidth=2072&originalType=binary&ratio=1&rotation=0&showTitle=false&size=812490&status=done&style=none&taskId=ud40805ca-60a2-48de-bf29-db519276b51&title=&width=1036)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/1347081/1648091965814-ed38d753-613a-403b-a5f3-c7fe3328b794.png#clientId=ua703f057-751e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=623&id=u7ea527c3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1246&originWidth=2750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1493898&status=done&style=none&taskId=u04b9c6f0-07b8-4bcf-a11a-25a6cb9b074&title=&width=1375)
