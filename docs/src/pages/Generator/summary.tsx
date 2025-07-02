import { Grid, Typography } from "@mui/material";
import { useGeneratorStateContext } from "../../contexts/generatorState/context";
import PartCard from "../../components/PartCard";
import { useMemo } from "react";
import { Material } from "../../types/Materials";
import BomGrid from "../../components/BomGrid";

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
                <BomGrid
                    bom={bom} />
            </Grid>
        </Grid>
    )
}

export default Summary;