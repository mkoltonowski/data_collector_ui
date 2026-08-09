import { useMutation } from "@tanstack/react-query"
import type { FormValues } from "../components/organisms/experiment-form.tsx"

export const useSaveResults = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationKey: ["save-results"],
    mutationFn: async (variables: FormValues) =>
      fetch("/inference/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(variables)
      }).then(res => res.json()),
    onSuccess: onSuccess
  })
}
