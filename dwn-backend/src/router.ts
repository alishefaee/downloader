import express from "express"
import cors from "cors"
import ytdl, {videoFormat} from 'ytdl-core'
import {downloadVideo} from './youtube'
import path from "path";

const router = express.Router()

router.use(cors({
    origin: '*'
}))

export interface ICache {
    url:string,
    vid:string,
    title:string,
    formats:videoFormat[]
}

// let cache: { [key:string]: ICache }
let cache = new Map<string,ICache>()

setInterval(()=>{
    if (cache.size>20){
        let i = 0;
        for (let k of cache.keys()) {
            if (i++ > 100) break
            cache.delete(k);
        }
    }
},12*60*60*1000)

router.get('/', (req: express.Request, res: express.Response) => {
    return res.send("Home Page")
})

router.get('/download', async (req: express.Request, res: express.Response) => {
    let {url} = req.query
    let v_id = url.split('v=')[1]
    let info = await ytdl.getInfo(url)
    let resp = {
        url: "https://www.youtube.com/embed/" + v_id,
        vid: v_id,
        title: info.videoDetails.title,
        formats: info.formats,
    }
    cache.set(v_id,resp)
    return res.json(resp)
})

router.get('/send', async (req: express.Request, res: express.Response) => {
    let {v_id} = req.body
    let obj = cache.get(v_id)
    await downloadVideo(obj, path.join(__dirname, 'public', `${obj.title}.mp4`))
    res.send("OK")
    return
})

export default router