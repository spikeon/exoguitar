import { Grid, Typography } from "@mui/material";
import { NeckType } from "../../../types/State";
import GeneratorCard from "../../../components/GeneratorCard";
import { useGeneratorStateContext, useGeneratorStateActionsContext } from "../../../contexts/generatorState/context";
import { usePartsContext } from "../../../contexts/parts/context";
import { Part } from "../../../types/Parts";

import woodNeckImage from "./images/wood.jpeg";
import printedNeckImage from "./images/printed.png";

import { StepProps } from "./step.types";

const StepNeckTypes = ({onComplete}: StepProps) => {
    const {neckType} = useGeneratorStateContext();
    const {setNeckType, setNeck, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.requiredParts) return;
        for(const rpName of part.requiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }

    const handleNeckTypeWood = () => {
        setNeckType(NeckType.WOOD);
        const shoulder = parts.find((part) => part.name === "Offset - Regular Neck");
        if(shoulder) {
            addRequiredParts(shoulder);
            setNeck(shoulder);
        }
        onComplete();
    }

    const handleNeckTypePrinted = () => {
        setNeckType(NeckType.PRINTED);
        onComplete();
    }

    return (
        <Grid container spacing={2}>
            { neckType === undefined ? (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Choose Neck Type:
                    </Typography>
                </Grid>
                <Grid size={6}>
                    <GeneratorCard
                        onClick={handleNeckTypeWood}
                        image={woodNeckImage}
                        title="Wooden" />
                </Grid>
                <Grid size={6}>
                    <GeneratorCard
                        onClick={handleNeckTypePrinted}
                        image={printedNeckImage}
                        title="Printed" />
                </Grid>
            </>) : (
                <Grid size={12}><Typography sx={{ mt: 2, mb: 1 }}>Selected Neck Type: {neckType === NeckType.WOOD ? "Wood" : "Printed"}</Typography></Grid>
            ) }
        </Grid>
    )
}

export default StepNeckTypes;