import { Button, Grid, Typography } from "@mui/material";
import { useGeneratorStateContext } from "../../contexts/generatorState/context";
import PartCard from "./PartCard";
import { useMemo } from "react";
import { Material } from "../../types/Materials";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const Summary = () => {

    const {head, neck, facePlate, bridge, wingSet, extras} = useGeneratorStateContext();

    const selectedParts = useMemo(() => [head, neck, facePlate, bridge, wingSet, ...extras], [head, neck, facePlate, bridge, wingSet, extras]);

    const bom = useMemo(() => {
        const materials: Material[] = []
        for(const selectedPart of selectedParts){
            if(!selectedPart) continue;
            if(!selectedPart.bom) continue;
            for(const mat of selectedPart.bom){
                const mid = materials.findIndex((m) => m.name === mat.name);
                if(mid === -1) materials.push(mat);
                else materials[mid].qty += mat.qty;
            }
        }
        return materials;
    }, [selectedParts]);

    const columns: GridColDef<Material>[] = [
        {
            field: "qty",
            headerName: "Quantity",
            type: "number",
            width: 120,
            align: "left"
        },
        {
            field: "name",
            headerName: "Name",
            width:500
        },
        {
            field: "amazon_url",
            headerName: "Links",
            width: 200,
            sortable: false,            
            renderCell: ({value}: GridRenderCellParams<any, string>) => (<a href={value} target="_blank" rel="noreferrer"><Button variant="contained">Amazon</Button></a>),
            align: "right"
        }
    ]

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography 
                    gutterBottom 
                    sx={{mt: 5}}
                    variant="h4" 
                    component="div"
                    align="center">
                        Chosen  Parts
                    </Typography>
            </Grid>
            {selectedParts.filter((p) => p !== undefined).map((part) => (
                <Grid size={6} key={part?.name}>
                    <PartCard
                        part={part}
                        onClick={() => {}} />
                </Grid>
            ))}
            <Grid size={12}>
                <Typography 
                    gutterBottom 
                    sx={{mt: 5}}
                    variant="h4" 
                    component="div"
                    align="center">
                        BOM
                    </Typography>
            </Grid>
            <Grid size={12}>
                <DataGrid 
                    rows={bom}
                    columns={columns}
                    getRowId={(m) => m.name}
                    />
            </Grid>
        </Grid>
    )
}

export default Summary;