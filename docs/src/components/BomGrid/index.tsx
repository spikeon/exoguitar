import { Button } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Material } from "../../types/Materials"

export type BomGridProps = {
    bom: Material[]
}


const columns: GridColDef<Material>[] = [
    {
        field: "qty",
        headerName: "Quantity",
        type: "number",
        align: "left",
        flex: 1,
    },
    {
        field: "name",
        headerName: "Name",
        flex: 5
    },
    {
        field: "amazon_url",
        headerName: "Links",
        flex: 2,
        sortable: false,            
        renderCell: ({value}: GridRenderCellParams<any, string>) => (<a href={value} target="_blank" rel="noreferrer"><Button variant="contained">Amazon</Button></a>),
        align: "right"
    }
]

const BomGrid = ({bom}:BomGridProps) => {

    return(
        <DataGrid
            rows={bom}
            columns={columns}
            getRowId={(m) => m.name}
            />
    )
}

export default BomGrid;