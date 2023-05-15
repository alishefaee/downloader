import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";
import {ICache} from "./interfaces/viedo-data.interface";

const HOST = 'localhost:3000'


function App() {
    const [videoUrl, setVideoUrl] = useState('')
    const [playlistUrl, setPlaylistUrl] = useState('')
    const [videoData, setVideoData] = useState<ICache|null>({})
    const [playlistData, setPlaylistData] = useState<string[] | undefined>(undefined)
    const [downloadFinished,setDownloadFinished] = useState(false)

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
            setDownloadFinished(false)
            let resp = await axios.get(`${HOST}/playlist?url=${playlistUrl}`)
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

    return (
        <>
            <div>
                {downloadFinished?<p>Finished</p>:<p>Downloading</p>}
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
                        {videoData.formats.map(vid=><p>
                            <span>vid.container</span> 
                            <span>vid.qualityLabel</span> 
                            <span>vid.height</span> 
                            <span>vid.contentLength</span> 
                            <span>vid.approxDurationMs</span> 
                            <span>vid.targetDurationSec</span> 
                            <span>vid.maxDvrDurationSec</span> 
                            <button onClick={(e)=>downloadVideo(e,videoData.v_id,vid.url)}>Download</button>
                        </p>)}
                    </div>
                    : null
                }
            </div>
        </>
    )
}

export default App
