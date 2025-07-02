import { Grid } from "@mui/material";
import { useGeneratorStateContext, useGeneratorStateActionsContext } from "../../../contexts/generatorState/context";
import { usePartsContext } from "../../../contexts/parts/context";
import { Part } from "../../../types/Parts";
import SectionSelector from "../../../components/SectionSelector";
import { StepProps } from "./step.types";

const StepFacePlates = ({onComplete}:StepProps) => {

    const {facePlate} = useGeneratorStateContext();
    const {setFacePlate, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.requiredParts) return;
        for(const rpName of part.requiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }
    
    const handleFacePlate = (facePlate: Part) => {
        addRequiredParts(facePlate);
        setFacePlate(facePlate);
        onComplete();
    }

    return (
        <Grid container spacing={2}>
            <SectionSelector
                sectionName="Face Plates" 
                part={facePlate} 
                selectPart={handleFacePlate} 
                partFilter={(part: Part) => part.name !== "Acoustic" } />
        </Grid>
    )
}

export default StepFacePlates;