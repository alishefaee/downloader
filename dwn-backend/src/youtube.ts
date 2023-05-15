import axios from 'axios'
import {promisify} from 'util'
import stream from 'stream'
import fs from 'fs'
import {ICache} from "./router";
import ytpl from 'ytpl'

const finished = promisify(stream.finished);

export const downloadVideo = (obj:ICache, outputLocationPath)=> {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
        method: 'get',
        url: obj.url,
        responseType: 'stream',
    }).then(response => {
        response.data.pipe(writer);

        return finished(writer); //this is a Promise
    });
}

export const playlistInfo = async (url:string) => {
    let id = await ytpl.getPlaylistID(url)
    console.log('id',id)
    const playlist = await ytpl(id)
    const items = playlist.items
    return items.map(i=>i.shortUrl)
}