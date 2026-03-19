import {useQuery} from "@tanstack/react-query";

export const useInference = () => {
    const refreshRate = 1000 / 5; // 5 times per second

    return useQuery<{probability: number, time_ms: number}, Error>({
        queryKey: ['inference'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/inference/');
            return response.json();
        },
        refetchInterval: refreshRate,
    })
};