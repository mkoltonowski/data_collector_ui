import { Box } from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useGetResults } from "../../hooks/useGetResults.ts"

const columns: GridColDef[] = [
  {
    field: "humidity",
    headerName: "Humidity",
    width: 150,
    editable: false
  },
  {
    field: "temperature",
    headerName: "Temperature",
    width: 150,
    editable: false
  },
  {
    field: "e_co2",
    headerName: "ECO2",
    width: 150,
    editable: false
  },
  {
    field: "tvoc",
    headerName: "TVOC",
    width: 150,
    editable: false
  },
  {
    field: "pm1",
    headerName: "PM1",
    width: 150,
    editable: false
  },
  {
    field: "pm2_5",
    headerName: "PM 2.5",
    width: 150,
    editable: false
  },
  {
    field: "model_probability",
    headerName: "Model Probability",
    width: 150,
    editable: false
  },
  {
    field: "model",
    headerName: "Model",
    width: 150,
    editable: false
  },
  {
    field: "iso_time",
    headerName: "Time",
    width: 150,
    editable: false,
    renderCell: params => new Date(Number(params.row.iso_time)).toISOString()
  },
  {
    field: "true_label",
    headerName: "True Label",
    width: 150,
    editable: false
  }
]

export const LastResultsTable = () => {
  const { data: results } = useGetResults()

  return (
    <Box>
      <DataGrid columns={columns} rows={results ?? []} />
    </Box>
  )
}
