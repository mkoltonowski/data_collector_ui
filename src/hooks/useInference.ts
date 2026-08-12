import { useQuery } from "@tanstack/react-query"
import type { ModelValues } from "../const"

export type SensorData = { temp: number; hum: number; TVOC: number; eCO2: number; AQI: number; PM1: number; PM2_5: number }
export type InferenceData = { probability: number; time_ms: number; sensor_data: SensorData }

const modelToPath: Record<ModelValues, string> = {
  small: "/inference",
  large: "/inference",
  "multimodal-small": "/inference/multimodal",
  "multimodal-late": "/inference/multimodal/late-fusion"
}

export const useInference = (model: ModelValues, fusionHead: number) => {
  const variant = model.includes("small") ? "small" : "large"
  const modalityPath = modelToPath[model]
  const rateMultiplier = variant === "small" ? 5 : 1
  const refreshRate = 1000 / rateMultiplier // 5 times per second

  return useQuery<InferenceData, Error>({
    queryKey: ["inference"],
    queryFn: async () => {
      const response = await fetch(`${modalityPath}?model=` + variant + "&fusion_head=" + fusionHead, { method: "GET" })
      return response.json()
    },
    refetchInterval: refreshRate
  })
}
