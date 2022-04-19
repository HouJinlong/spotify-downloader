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