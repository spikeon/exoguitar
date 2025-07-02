import { Grid } from "@mui/material";
import { useGeneratorStateActionsContext, useGeneratorStateContext } from "../../../contexts/generatorState/context";
import { Part } from "../../../types/Parts";
import { usePartsContext } from "../../../contexts/parts/context";
import SectionSelector from "../../../components/SectionSelector";
import { StepProps } from "./step.types";

const StepBridges = ({onComplete}: StepProps) => {

    const {bridge} = useGeneratorStateContext();
    const {setBridge, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.requiredParts) return;
        for(const rpName of part.requiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }

    const handleBridge = (bridge: Part) => {
        addRequiredParts(bridge);
        setBridge(bridge);
        onComplete();
    }

    return (
        <Grid container spacing={2}>
            <SectionSelector
                sectionName="Bridge" 
                part={bridge} 
                selectPart={handleBridge} 
                partFilter={(part: Part) => true } />
        </Grid>
    )
}

export default StepBridges;