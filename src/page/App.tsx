import {useEffect, useMemo, useRef} from 'react'
import {Box, Stack, styled, Typography} from "@mui/material";
import Hls from "hls.js";
import {useInference} from "../hooks/useInference.ts";

const StyledContainer = styled(Stack)({
    maxWidth: '100vw',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '1rem',
})

const gradient = 'radial-gradient(circle,rgba(25, 25, 28, 1) 0%, rgba(10, 12, 16, 1) 100%);'

const VideoContainer = styled(Box)({
    display: 'flex',
    background: gradient,
    borderRadius:'1rem',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 16/9,
})

const VideoBoxContainer = styled(Stack)({
    display: 'flex',
    borderRadius:'1rem',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 16/9,
    overflow: 'hidden',
    boxShadow:'0px 0px 20px 5px #9d2f00',
})

const src = '/stream/stream.m3u8';


function App() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { data } = useInference();

    useEffect(() => {
        if (Hls.isSupported() && videoRef.current) {
            const hls = new Hls({ lowLatencyMode: true, liveSyncDurationCount: 2 });
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
        } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = src; // Safari/iOS
        }
    }, []);

    const ProbabilityContainer = useMemo(()=>{
        return (
            <Box display={'flex'} bgcolor={'#291100'} borderRadius={'1rem'} p={2} gap={2} boxShadow={'0px 3px 36px -1px rgb(254.99, 100.92, 48.5)'}>
                <Typography  fontWeight={500} fontSize={'1rem'}>Fire Hazard probability:&nbsp;</Typography>
                <Typography  fontWeight={500} fontSize={'1rem'}>{data?.probability ?? 0}</Typography>
            </Box>
        )
    }, [data])

    const ImageContainer = useMemo(()=>{
        return (
            <img src={`/inference-image-feed?type=${data?.time_ms ?? 0}`} alt={'fire_detection'}/>
        )
    }, [data])

    return (
    <>
        <StyledContainer gap={10}>
            <Box>
                <Typography color='#ff6c65' textTransform={'uppercase'} fontWeight={600} fontSize={'2.5rem'}>Raspberry PI 4</Typography>
                <Typography  fontWeight={500} fontSize={'1rem'}>Fire Detection</Typography>
            </Box>

            <Box display={'flex'} gap={10} width='100%'>
                <VideoBoxContainer display={'flex'} gap={2}>
                    <Typography p={1}> Raw video output</Typography>
                    <VideoContainer>
                        <video
                            ref={videoRef} id="v_stream" autoPlay muted playsInline style={{width: "100%", height:'100%'}}></video>
                    </VideoContainer>
                </VideoBoxContainer>


                <VideoBoxContainer display={'flex'} gap={2}>
                    <Typography> Preprocessed video output</Typography>
                    <VideoContainer>
                        {ImageContainer}
                    </VideoContainer>

                </VideoBoxContainer>

            </Box>
            {ProbabilityContainer}
        </StyledContainer>
    </>
  )
}

export default App
