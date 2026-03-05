import { Grid, Typography } from "@mui/material";
import { useGeneratorStateContext } from "../../contexts/generatorState/context";
import { usePartsContext } from "../../contexts/parts/context";
import PartCard from "../../components/PartCard";
import { useMemo } from "react";
import BomGrid from "../../components/BomGrid";
import { generateCombinedBOM } from "../../utils/BomUtils";
import { Part } from "../../types/Parts";

const NECK_V3_PART_NAME = "Neck v3";

const Summary = () => {

    const {head, facePlate, bridge, wingSet, extras} = useGeneratorStateContext();
    const {parts} = usePartsContext();

    const selectedParts: Part[] = useMemo(() => {
        const neckV3 = parts.find((p) => p.name === NECK_V3_PART_NAME);
        return [head, facePlate, bridge, wingSet, neckV3, ...extras].filter((p): p is Part => p !== undefined);
    }, [head, facePlate, bridge, wingSet, extras, parts]);
    
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