import { Grid,Typography } from "@mui/material";
import woodNeckImage from "./images/wood.jpeg";
import printedNeckImage from "./images/printed.png";
import { useGeneratorStateActionsContext, useGeneratorStateContext } from "../../contexts/generatorState/context";
import { NeckType } from "../../types/State";
import GeneratorCard from "./GeneratorCard";
import { Part } from "../../types/Parts";
import { usePartsContext } from "../../contexts/parts/context";
import SectionSelector from "./SectionSelector";

const woodNeckName = "Offset - Regular Neck";

const Step2 = () => {

    const {neckType, neck, head} = useGeneratorStateContext();
    const {setNeckType, setNeck, setHead, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.reqiredParts) return;
        for(const rpName of part.reqiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }

    const handleNeckTypeWood = () => {
        setNeckType(NeckType.WOOD);
        const shoulder = parts.find((part) => part.name === woodNeckName);
        if(shoulder) handleNeck(shoulder);
    }

    const handleNeckTypePrinted = () => {
        setNeckType(NeckType.PRINTED);
    }

    const handleNeck = (neck: Part) => {
        addRequiredParts(neck);
        setNeck(neck);
    }

    const handleHead = (head: Part) => {
        addRequiredParts(head);
        setHead(head);
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
            { neckType === NeckType.PRINTED && (
                <SectionSelector
                    sectionName="Neck" 
                    part={neck} 
                    selectPart={handleNeck} 
                    partFilter={(part: Part) => part.name !== "Sanding Jig" } />
            )}
            { neckType === NeckType.PRINTED && (
                <SectionSelector
                    sectionName="Head" 
                    part={head} 
                    selectPart={handleHead} 
                    partFilter={(part: Part) => true } />
            )}
        </Grid>
    )
}

export default Step2;