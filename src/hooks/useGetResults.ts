import { useQuery } from "@tanstack/react-query"

export const useGetResults = () => {
  return useQuery({
    queryKey: ["get-results"],
    queryFn: async () => fetch("/inference/saved/all", { method: "GET" }).then(res => res.json()),
    refetchInterval: 30_000
  })
}
