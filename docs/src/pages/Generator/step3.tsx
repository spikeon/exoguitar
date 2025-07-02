import { Grid } from "@mui/material";
import { useGeneratorStateActionsContext, useGeneratorStateContext } from "../../contexts/generatorState/context";
import { Part } from "../../types/Parts";
import { usePartsContext } from "../../contexts/parts/context";
import SectionSelector from "./SectionSelector";

const Step3 = () => {

    const {wingSet} = useGeneratorStateContext();
    const {setWingSet, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.requiredParts) return;
        for(const rpName of part.requiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }

    const handleWingSet = (wingSet: Part) => {
        addRequiredParts(wingSet);   
        setWingSet(wingSet);
    }

    return (
        <Grid container spacing={2}>
            <SectionSelector
                sectionName="Wing Sets" 
                part={wingSet} 
                selectPart={handleWingSet} 
                partFilter={(part: Part) => true } />
        </Grid>
    )
}

export default Step3;