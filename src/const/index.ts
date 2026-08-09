export type ModelValues = "small" | "large" | "multimodal-small"

export const modelValueToLabelMap: Record<ModelValues, string> = {
  small: "Mobile Net V3 Small",
  large: "Mobile Net V3 Large",
  "multimodal-small": "Multimodal Mobile Net V3 Small"
}
