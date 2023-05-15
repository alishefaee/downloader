import {videoFormat} from "./videoFormat.interface";

export interface ICache {
    url:string,
    v_id:string,
    title:string,
    formats:videoFormat[]
}