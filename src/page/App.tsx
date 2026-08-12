import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent, Stack, styled, Button, Typography, Input } from "@mui/material"
import Hls from "hls.js"
import { useInference } from "../hooks/useInference.ts"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import { ExperimentForm, type FetchedData } from "../components/organisms/experiment-form.tsx"
import { type ModelValues, modelValueToLabelMap } from "../const"
import { LastResultsTable } from "../components/organisms/last-results-table.tsx"

const StyledContainer = styled(Stack)({
  maxWidth: "100vw",
  height: "100%",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  padding: "2rem"
})

const gradient = "radial-gradient(circle,rgba(25, 25, 28, 1) 0%, rgba(10, 12, 16, 1) 100%);"

const VideoContainer = styled(Box)({
  display: "flex",
  background: gradient,
  borderRadius: "1rem",
  justifyContent: "center",
  width: "100%",
  aspectRatio: 16 / 9
})

const VideoBoxContainer = styled(Stack)({
  display: "flex",
  borderRadius: "1rem",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  boxShadow: "0px 0px 20px 5px #9d2f00",
  transition: "all 0.6s ease-in-out"
})

const src = "/stream/stream.m3u8"

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [model, setModel] = useState<ModelValues>("small")
  const [streamMaxView, setMaxView] = useState<boolean>(false)
  const [fusionHead, setFusionHead] = useState<number>(0.5)

  const onFusionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    const value = Number(e.target.value)
    const isBetween = value >= 0 && value <= 1
    if (!isBetween) {
      return
    }

    setFusionHead(value)
  }

  const { data } = useInference(model, fusionHead)

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({ lowLatencyMode: false, backBufferLength: 10, maxBufferLength: 10, maxMaxBufferLength: 20, liveSyncDurationCount: 2, liveMaxLatencyDurationCount: 4 })
      hls.loadSource(src)
      hls.attachMedia(videoRef.current)
    } else if (videoRef.current && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src // Safari/iOS
    }
  }, [])

  const ProbabilityContainer = useMemo(() => {
    return (
      <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} bgcolor={"#291100"} borderRadius={"1rem"} p={2} gap={5} boxShadow={"0px 3px 23px -1px rgb(254.99, 100.92, 48.5)"}>
        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            Fire Hazard model probability:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {((data?.probability ?? 0) * 100).toFixed(2)} %
          </Typography>
        </Box>

        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            Temperature:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {data?.sensor_data?.temp ?? 0} °C
          </Typography>
        </Box>

        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            Humidity:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {(data?.sensor_data?.hum ?? 0).toFixed(2)} %
          </Typography>
        </Box>

        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            TVOC:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {data?.sensor_data?.TVOC ?? 0} ppb
          </Typography>
        </Box>

        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            eCO2:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {data?.sensor_data?.eCO2 ?? 0} ppm
          </Typography>
        </Box>

        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            PM1:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {data?.sensor_data?.PM1 ?? 0} µg/m3
          </Typography>
        </Box>

        <Box>
          <Typography fontWeight={500} fontSize={"1rem"}>
            PM1:&nbsp;
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            {data?.sensor_data?.PM2_5 ?? 0} µg/m3
          </Typography>
        </Box>
      </Box>
    )
  }, [data])

  const ImageContainer = useMemo(() => {
    return <img src={`/inference-image-feed?type=${data?.time_ms ?? 0}`} alt={"fire_detection"} />
  }, [data])

  const mappedResults = useMemo<FetchedData>(() => {
    if (!data) {
      return {
        humidity: 0,
        experiment: "",
        temperature: 0,
        tvoc: 0,
        e_co2: 0,
        model_probability: 0,
        iso_time: new Date().getTime().toString(),
        model: model,
        pm1: 0,
        pm2_5: 0
      }
    }

    const { sensor_data } = data

    return {
      humidity: sensor_data.hum,
      temperature: sensor_data.temp,
      tvoc: sensor_data.TVOC,
      e_co2: sensor_data.eCO2,
      iso_time: new Date().getTime().toString(),
      model_probability: data.probability,
      model: modelValueToLabelMap[model],
      experiment: "",
      pm1: sensor_data.PM1,
      pm2_5: sensor_data.PM2_5
    }
  }, [data, model])

  return (
    <>
      <StyledContainer gap={10}>
        <Box sx={{ opacity: streamMaxView ? 0 : 1, display: streamMaxView ? "none" : "default" }}>
          <Typography color="#ff6c65" textTransform={"uppercase"} fontWeight={600} fontSize={"2.5rem"}>
            Raspberry PI 4
          </Typography>
          <Typography fontWeight={500} fontSize={"1rem"}>
            Fire Detection
          </Typography>
        </Box>

        <Box display={"flex"} flexDirection={{ xs: "column", sm: "row" }} gap={streamMaxView ? 4 : 10} width="100%">
          <VideoBoxContainer sx={{ aspectRatio: 16 / 9 }} display={"flex"} gap={2}>
            <Box display={"flex"}>
              <Typography padding={2} display={streamMaxView ? "none" : "flex"} color={"#FFF"}>
                {" "}
                HLS 1080p stream [2s delay]
              </Typography>
              <Button
                endIcon={<FullscreenIcon />}
                variant={"contained"}
                sx={{
                  position: streamMaxView ? "absolute" : "static",
                  right: streamMaxView ? "4rem" : "unset",
                  top: streamMaxView ? "4rem" : "unset"
                }}
                onClick={async () => {
                  setMaxView((prevState: boolean) => !prevState)
                  if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen()
                  } else {
                    await document.exitFullscreen()
                  }
                }}>
                FullScreen
              </Button>
            </Box>
            <VideoContainer>
              <video ref={videoRef} id="v_stream" autoPlay muted playsInline style={{ width: "100%", height: "100%" }}></video>
            </VideoContainer>
          </VideoBoxContainer>

          <VideoBoxContainer
            width={
              streamMaxView
                ? {
                    sx: "100%",
                    sm: "25% !Important"
                  }
                : 0
            }
            sx={{
              position: streamMaxView ? { xs: "static", sm: "absolute" } : "static",
              boxShadow: streamMaxView ? "0px 0px 20px 2px #9d2f00fA" : "none"
            }}
            display={"flex"}
            gap={2}>
            <Typography display={streamMaxView ? "none" : "flex"} padding={2}>
              {" "}
              224x224 image input
            </Typography>
            <VideoContainer>{ImageContainer}</VideoContainer>
          </VideoBoxContainer>
        </Box>

        {/* DATA PANEL */}
        <Box
          display={"flex"}
          flexDirection={{ xs: "column", sm: "row" }}
          padding={4}
          gap={2}
          width={"100%"}
          justifyContent={"center"}
          sx={{
            position: streamMaxView ? "absolute" : "static",
            bottom: {
              xs: streamMaxView ? "-2rem" : "unset",
              sm: streamMaxView ? "0rem" : "unset"
            },
            opacity: streamMaxView ? 0.6 : 1
          }}>
          {ProbabilityContainer}
          <Box
            display={"flex"}
            width={{ xs: "100%", sm: "45%" }}
            flexDirection={{ xs: "column", sm: "row" }}
            bgcolor={"#291100"}
            borderRadius={"1rem"}
            alignItems={"center"}
            p={2}
            gap={5}
            boxShadow={"0px 3px 24px -1px rgb(254.99, 100.92, 48.5)"}>
            <FormControl variant="standard">
              <InputLabel sx={{ color: "#FFF" }} id="model-select-label">
                Model
              </InputLabel>
              <Select
                sx={{
                  color: "#FFF",
                  borderBottom: "1px solid #ced4da",
                  "& svg": { color: "#FFF" }
                }}
                labelId="model-select-label"
                id="model-select"
                value={model}
                label="model"
                onChange={(e: SelectChangeEvent<string>) => setModel(e.target.value as ModelValues)}>
                <MenuItem value={"large"}>Mobile Net V3 Large</MenuItem>
                <MenuItem value={"small"}>Mobile Net V3 Small</MenuItem>
                <MenuItem value={"multimodal-small"}>Multimodal Mobile Net V3 Small</MenuItem>
                <MenuItem value={"multimodal-late"}>Multimodal Late Fusion</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard">
              <InputLabel sx={{ color: "#FFF" }} id="model-select-head-label">
                Fusion Image Weight
              </InputLabel>
              <Input disabled={model !== "multimodal-late"} onChange={onFusionChange} type="number" value={fusionHead} sx={{ color: "#FFF" }} />
            </FormControl>

            <ExperimentForm results={mappedResults} />
          </Box>
        </Box>

        <Box>
          <LastResultsTable />
        </Box>
      </StyledContainer>
    </>
  )
}

export default App
