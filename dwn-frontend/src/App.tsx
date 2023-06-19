import {useState} from 'react'
import './App.css'
import axios from "axios";
import {ICache} from "./interfaces/viedo-data.interface";
import {IPlaylist} from "./interfaces/playlist.interface";

const HOST = 'http://127.0.0.1:3000'


function App() {
    const [videoUrl, setVideoUrl] = useState('')
    const [playlistUrl, setPlaylistUrl] = useState('')
    const [videoData, setVideoData] = useState<ICache|null>({})
    const [playlistData, setPlaylistData] = useState<IPlaylist | undefined>(undefined)
    const [downloadFinished,setDownloadFinished] = useState(true)

    async function videoGetInfo() {
        try {
            setDownloadFinished(false)
            let resp = await axios.get(`${HOST}/video-info?url=${videoUrl}`)
            setVideoData(resp.data)
        } catch (e) {
            console.log(e)
        }
    }

    async function playlistGetInfo() {
        try {
            setDownloadFinished(true)
            let resp = await axios.get(`${HOST}/playlist`,{params:{url:playlistUrl}})
            console.log(resp.data)
            setPlaylistData(resp.data)
        } catch (e) {
            console.log(e)
        }
    }

    async function downloadVideo(e: React.MouseEvent<HTMLButtonElement>, v_id: string, url: string) {
        try {
            let resp = await axios.post(`${HOST}/download`, {v_id, url})
            if (resp.data == 'OK') setDownloadFinished(true)
        } catch (e) {
            console.log(e)
        }
    }

    function downloadAllPly() {

    }

    return (
        <>
            <div>
                {downloadFinished?<p>No Download</p>:<p>Downloading</p>}
                <label htmlFor="input-video">Video Url</label>
                <input
                    id='input-video'
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.currentTarget.value)}
                />
                <button onClick={() => videoGetInfo()}>Get Info</button>
                <label htmlFor="input-playlist">Playlist Url</label>
                <input
                    id='input-playlist'
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.currentTarget.value)}
                />
                <button onClick={() => playlistGetInfo()}>Get Info</button>
            </div>
            <div>
                {videoData ?
                    <div>
                        <p>{videoData.title}</p>
                        {videoData.formats?.map(vid=><p>
                            <span>{vid.container}</span>&#8739;
                            <span>{vid.qualityLabel}</span>&#8739;
                            <span>{(vid.contentLength/1024/1024).toFixed(1)} MB</span>&#8739;
                            <span>{(vid.approxDurationMs/1000/60).toFixed(1)} Min</span>
                            <span>{vid.targetDurationSec}</span>
                            <span>{vid.maxDvrDurationSec}</span>
                            <button onClick={(e)=>downloadVideo(e,videoData.v_id,vid.url)}>Download</button>
                        </p>)}
                    </div>
                    : null
                }
                {playlistData?<div>
                    <p>{playlistData.title}&#8739;count:{playlistData.estimatedItemCount}</p>
                    <button onClick={()=>{downloadAllPly()}}>Download All</button>
                    {playlistData.items.map(item=><p>
                        <span>{item.title}</span>&#8739;
                        <span>{item.shortUrl}</span>&#8739;
                        <span>{item.duration} Min</span>&#8739;
                    </p>)}
                </div>:null}
            </div>
        </>
    )
}

export default App
