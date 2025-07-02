import { Grid, Typography } from "@mui/material";
import { useGeneratorStateContext } from "../../contexts/generatorState/context";
import PartCard from "../../components/PartCard";
import { useMemo } from "react";
import BomGrid from "../../components/BomGrid";
import { generateCombinedBOM } from "../../utils/BomUtils";
import { Part } from "../../types/Parts";

const Summary = () => {

    const {head, neck, facePlate, bridge, wingSet, extras} = useGeneratorStateContext();

    const selectedParts: Part[] = useMemo(() : Part[] =>  [head, neck, facePlate, bridge, wingSet, ...extras].filter((p) => p !== undefined) as Part[], [head, neck, facePlate, bridge, wingSet, extras]);
    
    const bom = useMemo(() => {
        return generateCombinedBOM(selectedParts);
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
                <Grid size={4} key={part?.name}>
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