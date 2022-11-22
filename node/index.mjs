import {execa} from 'execa';
import fs from 'fs';
import koa from 'koa';
import koaRouter from 'koa-router';
import cors from 'koa2-cors'
import koaBody from 'koa-body';
import serve from 'koa-static-server';
const router = koaRouter()
const app = new koa()
const DOMAIN = process.env.DOMAIN
app.use(cors({
    // allowHeaders: ['X-Authorization'],
  }));
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 20000 * 1024 * 1024
    }
}))
// spotify
const has = (id)=>{
    if(fs.existsSync(`./output/${id}.mp3`)){
        return {
            status:1,
            url:`${DOMAIN}/file/${id}.mp3`
        }
    }else if(fs.existsSync(`./error/${id}`)){
        return {
            status:-1,
        }
    }
    return {
        status:0,
    }
}
let tempMap = {

}

router.get('/spotify/start', (ctx) => {
    const {id} = ctx.request.query
    const {status} = has(id)
    if(status===0&&!tempMap[id]){
        tempMap[id] = true
        execa("spotdl",['https://open.spotify.com/track/'+id,'--use-youtube','--ffmpeg','../ffmpeg-5.0-amd64-static/ffmpeg','--path-template',`./output/${id}.{ext}`]).then(result =>{
            if(result.stdout.indexOf('Done')!==-1){
                console.log(new Date(),'成功')
            }else{
                fs.writeFileSync(`./error/${id}`,result.stdout)
            }
            delete tempMap[id]
        }).catch(err=>{
            delete tempMap[id]
            fs.writeFileSync(`./error/${id}`,err.toString())
        });
    }
    ctx.body = {}
});
// spotify + youtube
router.post('/youtube/start', (ctx) => {
    const {id,spotify,youtube} = JSON.parse(ctx.request.body)
    const {status} = has(id)
    if(status===0&&!tempMap[id]){
        tempMap[id] = true
        execa("spotdl",[`"${youtube}|${spotify}"`,'--use-youtube','--ffmpeg','../ffmpeg-5.0-amd64-static/ffmpeg','--path-template',`./output/${id}.{ext}`]).then(result =>{
            if(result.stdout.indexOf('Done')!==-1){
                console.log(new Date(),'成功')
            }else{
                fs.writeFileSync(`./error/${id}`,result.stdout)
            }
            delete tempMap[id]
        }).catch(err=>{
            delete tempMap[id]
            fs.writeFileSync(`./error/${id}`,err.toString())
        });
    }
    ctx.body = {}
});
router.get('/spotify/status', (ctx) => {
    const {id} = ctx.request.query
    ctx.body = has(id)
});


app.use(router.routes()).use(router.allowedMethods());
// 静态服务录音文件 ${DOMAIN}/file/
app.use(serve({rootDir: './output',rootPath: '/file'}))
app.use(serve({rootDir: './html',rootPath: '/'}))
app.listen(process.env.PORT, () => {
    console.log(`HTTPS Server is running on: ${process.env.DOMAIN}`)
})
  