import { useQuery } from "@tanstack/react-query"

export type SensorData = { temp: number; hum: number; TVOC: number; eCO2: number; AQI: number; PM1: number; PM2_5: number }
export type InferenceData = { probability: number; time_ms: number; sensor_data: SensorData }

export const useInference = (model: string) => {
  const variant = model.includes("small") ? "small" : "large"
  const modalityPath = model.includes("multimodal") ? "/multimodal" : ""
  const rateMultiplier = variant === "small" ? 5 : 1
  const refreshRate = 1000 / rateMultiplier // 5 times per second

  return useQuery<InferenceData, Error>({
    queryKey: ["inference"],
    queryFn: async () => {
      const response = await fetch(`/inference${modalityPath}?model=` + variant + "")
      return response.json()
    },
    refetchInterval: refreshRate
  })
}
