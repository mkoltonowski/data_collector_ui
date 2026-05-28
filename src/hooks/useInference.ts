import {useQuery} from "@tanstack/react-query";

export type SensorData = {temp: number, hum: number, TVOC: number, eCO2: number, AQI: number};
export type InferenceData = {probability: number, time_ms: number, sensor_data: SensorData};


export const useInference = () => {
    const refreshRate = 1000 / 5; // 5 times per second

    return useQuery<InferenceData, Error>({
        queryKey: ['inference'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/inference/');
            return response.json();
        },
        refetchInterval: refreshRate,
    })
};