import { Grid, Typography } from "@mui/material"
import { Part } from "../types/Parts"
import { usePartsContext } from "../contexts/parts/context"
import { useGeneratorStateContext } from "../contexts/generatorState/context"
import PartCard from "./PartCard"

type SectionSelectorProps = {
    part: Part | undefined,
    sectionName: string,
    selectPart: (part: Part) => void,
    partFilter: (part: Part) => boolean
}

const SectionSelector = ({part, sectionName, selectPart, partFilter}: SectionSelectorProps) => {
    const {sections} = usePartsContext();

    const {head, neck, bridge, facePlate, wingSet} = useGeneratorStateContext()

    const checkIncompatibilities = (part: Part) => {
        const selectedParts = [head, neck, bridge, facePlate, wingSet];
        
        // Check if any selected parts have a Compatible Parts list for this section, and filter accordingly
        for(const selectedPart of selectedParts){
            if(!selectedPart) continue;
            if(!selectedPart.compatibleParts) continue;
            if(!selectedPart.compatibleParts[sectionName]) continue;
            if(!selectedPart.compatibleParts[sectionName].includes(part.name)) return false;
        }

        // Check if this part is incompatible with any of the previously selected parts
        if(part.incompatibleParts) {
            for(const ipName of part.incompatibleParts){
                for(const selectedPart of selectedParts) {
                    if(!selectedPart) continue;
                    if(ipName === selectedPart.name) return false;
                }
            }
        }

        // Check if any previously selected parts list this as an incompatible part for good measure
        for(const selectedPart of selectedParts) {
            if(!selectedPart) continue;
            if(!selectedPart.incompatibleParts) continue;
            for(const ipName of selectedPart.incompatibleParts){
                if(ipName === part.name) return false;
            }
        }

        return true;
    }    
    
    return ( !part ? (<>
        <Grid size={12}><Typography sx={{ mt: 2, mb: 1 }}> Choose {sectionName}: </Typography></Grid>

        {
            sections
                .find((section) => section.name === sectionName)
                ?.parts
                ?.filter((part) => !part.hidden)
                ?.filter(checkIncompatibilities)
                ?.filter(partFilter)
                .map((part, i) => (
                    <Grid size={4} key={part.name}>
                        <PartCard
                            part={part}
                            onClick={() => selectPart(part)} />
                    </Grid>
            ))
        }
    </>) : (<>
        <Grid size={12}><Typography sx={{ mt: 2, mb: 1 }}>Selected {sectionName}: {part.name}</Typography></Grid>
    </>))
}

export default SectionSelector;