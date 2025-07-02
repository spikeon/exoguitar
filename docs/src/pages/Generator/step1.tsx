import { Grid,Typography } from "@mui/material";
import accousticImage from "./images/accoustic.jpeg";
import electricImage from "./images/electric.jpeg";
import { useGeneratorStateActionsContext, useGeneratorStateContext } from "../../contexts/generatorState/context";
import { GuitarType } from "../../types/State";
import GeneratorCard from "./GeneratorCard";
import { Part } from "../../types/Parts";
import { usePartsContext } from "../../contexts/parts/context";
import SectionSelector from "./SectionSelector";

const Step1 = () => {

    const {guitarType, facePlate, bridge} = useGeneratorStateContext();
    const {setGuitarType, setFacePlate, setBridge, setNeck, addExtra} = useGeneratorStateActionsContext();

    const {parts} = usePartsContext();

    const addRequiredParts = (part: Part) => {
        if(!part.reqiredParts) return;
        for(const rpName of part.reqiredParts){
            const rp = parts.find((p) => p.name === rpName)
            if(rp) addExtra(rp);
        }
    }

    const handleGuitarTypeAccoustic = () => {
        setGuitarType(GuitarType.ACCOUSTIC);
        const face = parts.find((part) => part.name === "Acoustic");
        if(face) setFacePlate( face );
    }

    const handleGuitarTypeElectric = () => {
        setGuitarType(GuitarType.ELECTRIC);
    }

    const handleFacePlate = (facePlate: Part) => {
        addRequiredParts(facePlate);
        setFacePlate(facePlate);
    }

    const handleBridge = (bridge: Part) => {
        addRequiredParts(bridge);
        setBridge(bridge);
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
            { guitarType === GuitarType.ELECTRIC && (
                <SectionSelector
                    sectionName="Face Plates" 
                    part={facePlate} 
                    selectPart={handleFacePlate} 
                    partFilter={(part: Part) => part.name !== "Acoustic" } />
            )}
            { guitarType === GuitarType.ELECTRIC && (
                <SectionSelector
                    sectionName="Bridge" 
                    part={bridge} 
                    selectPart={handleBridge} 
                    partFilter={(part: Part) => true } />
            )}
        </Grid>
    )
}

export default Step1;