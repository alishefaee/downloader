import axios from 'axios'
import {promisify} from 'util'
import stream from 'stream'
import fs from 'fs'
import {ICache} from "./router";

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