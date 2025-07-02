import { Grid, Typography } from "@mui/material";
import { GuitarType } from "../../../types/State";
import GeneratorCard from "../../../components/GeneratorCard";
import { useGeneratorStateContext, useGeneratorStateActionsContext } from "../../../contexts/generatorState/context";
import { usePartsContext } from "../../../contexts/parts/context";
import { Part } from "../../../types/Parts";

import accousticImage from "./images/accoustic.jpeg";
import electricImage from "./images/electric.jpeg";
import { StepProps } from "./step.types";

const StepGuitarTypes = ({onComplete}: StepProps) => {
    const {guitarType} = useGeneratorStateContext();
    const {setGuitarType, setFacePlate, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.requiredParts) return;
        for(const rpName of part.requiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }

    const handleGuitarTypeAccoustic = () => {
        setGuitarType(GuitarType.ACCOUSTIC);
        const face = parts.find((part) => part.name === "Acoustic");
        if(face) {
            addRequiredParts( face );
            setFacePlate( face );
        }
        onComplete();
    }

    const handleGuitarTypeElectric = () => {
        setGuitarType(GuitarType.ELECTRIC);
        onComplete();
    }

    return (
        <Grid container spacing={2}>
            { guitarType === undefined ? (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Choose Guitar Type:
                    </Typography>
                </Grid>
                <Grid size={6}>
                    <GeneratorCard
                        onClick={handleGuitarTypeAccoustic}
                        image={accousticImage}
                        title="Accoustic" />
                </Grid>
                <Grid size={6}>
                    <GeneratorCard
                        onClick={handleGuitarTypeElectric}
                        image={electricImage}
                        title="Electric" />
                </Grid>
            </>) : (
                <Grid size={12}><Typography sx={{ mt: 2, mb: 1 }}>Selected Guitar Type: {guitarType === GuitarType.ACCOUSTIC ? "Accoustic" : "Electric"}</Typography></Grid>
            ) }
        </Grid>
    )
}

export default StepGuitarTypes;