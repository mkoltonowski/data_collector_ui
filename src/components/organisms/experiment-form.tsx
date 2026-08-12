import { type FC, type ReactNode, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Snackbar, styled, Typography } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useSaveResults } from "../../hooks/useSaveResults.ts"

const formSchema = z.object({
  humidity: z.number(),
  experiment: z.string(),
  temperature: z.number(),
  e_co2: z.number(),
  tvoc: z.number(),
  pm1: z.number(),
  pm2_5: z.number(),
  model_probability: z.number(),
  model: z.string(),
  true_label: z.union([z.literal(0), z.literal(1)]),
  iso_time: z.string()
})

export type FormValues = z.infer<typeof formSchema>
export type FetchedData = Omit<FormValues, "true_label">

export const StyledForm = styled("form")({
  display: "flex",
  alignItems: "center",
  gap: "12px"
})

export const ExperimentForm: FC<{ results: FetchedData }> = ({ results }) => {
  const { control, handleSubmit, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...results,
      true_label: 0
    }
  })

  const [snackbarOpen, setSnackBar] = useState<ReactNode | null>(null)

  const closeSnackBar = () => setSnackBar(null)
  const openSnackBar = (message: ReactNode) => setSnackBar(message)

  const { mutate } = useSaveResults({
    onSuccess: () =>
      openSnackBar(
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <CheckCircleIcon fontSize="small" />
          <Typography>Experiment results were saved to DB</Typography>
        </Box>
      )
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
    mutate(data)
  }

  const onError = (errors: unknown) => {
    console.error(errors)
  }

  useEffect(() => {
    const currentValues = getValues()

    reset({
      ...results,
      true_label: currentValues.true_label,
      experiment: currentValues.experiment
    })
  }, [results, reset, getValues])

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit, onError)}>
      <FormControl variant="standard" size="small" fullWidth>
        <InputLabel
          id="model-result-label"
          sx={{
            width: 350,
            color: "#FFF",
            "&.Mui-focused": {
              color: "#FFF"
            }
          }}>
          User defined result
        </InputLabel>

        <Controller
          control={control}
          name="true_label"
          render={({ field }) => (
            <Select
              {...field}
              labelId="model-result-label"
              label="User defined result"
              sx={{
                color: "#FFF",
                borderBottom: "1px solid #ced4da",
                "& svg": { color: "#FFF" }
              }}>
              <MenuItem value={0}>Safe</MenuItem>
              <MenuItem value={1}>Fire Hazard</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <FormControl variant="standard" size="small" fullWidth>
        <InputLabel
          id="model-exp-label"
          sx={{
            width: 350,
            color: "#FFF",
            "&.Mui-focused": {
              color: "#FFF"
            }
          }}>
          Experiment
        </InputLabel>

        <Controller
          control={control}
          name="experiment"
          render={({ field }) => (
            <Input
              {...field}
              multiline={true}
              sx={{
                color: "#FFF",
                borderBottom: "1px solid #ced4da",
                "& svg": { color: "#FFF" }
              }}
            />
          )}
        />
      </FormControl>

      <Button type="submit">Save</Button>

      <Snackbar
        slotProps={{
          content: {
            sx: {
              border: "solid 0.25rem",
              borderColor: "#76aa76",
              background: "#1d4c1d"
            }
          }
        }}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!snackbarOpen}
        onClose={closeSnackBar}
        message={snackbarOpen}
      />
    </StyledForm>
  )
}
