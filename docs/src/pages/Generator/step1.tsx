import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import accousticImage from "./images/accoustic.jpeg";
import electricImage from "./images/electric.jpeg";
import { useGeneratorStateActionsContext, useGeneratorStateContext } from "../../contexts/generatorState/context";
import { GuitarType } from "../../types/State";
import GeneratorCard from "./GeneratorCard";
import { Part } from "../../types/Parts";
import { usePartsContext } from "../../contexts/parts/context";

const Step1 = () => {

    const {guitarType, facePlate, bridge} = useGeneratorStateContext();
    const {setGuitarType, setFacePlate, setBridge} = useGeneratorStateActionsContext();

    const {sections} = usePartsContext();

    const handleGuitarTypeAccoustic = () => {
        setGuitarType(GuitarType.ACCOUSTIC);
    }

    const handleGuitarTypeElectric = () => {
        setGuitarType(GuitarType.ELECTRIC);
    }

    const handleFacePlate = (facePlate: Part) => {
        setFacePlate(facePlate);
    }

    const handleBridge = (bridge: Part) => {
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
            </>) : (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Selected Guitar Type: {guitarType === GuitarType.ACCOUSTIC ? "Accoustic" : "Electric"}
                    </Typography>
                </Grid>
            </>) }
            { guitarType == GuitarType.ELECTRIC && (!facePlate ? (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Choose Face Plate:
                    </Typography>
                </Grid>
                {sections.find((section) => section.name === "Face Plates")?.parts?.filter((part) => part.name !== "Acoustic").map((part, i) => (
                    <Grid size={6}>
                        <GeneratorCard
                            onClick={() => handleFacePlate(part)}
                            image={part.thumb}
                            title={part.name} />
                    </Grid>
                ))}
            </>) : (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Selected Face Plate: {facePlate.name}
                    </Typography>
                </Grid>
            
            </>)) }
            { guitarType == GuitarType.ELECTRIC && (!bridge ? (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Choose Bridge:
                    </Typography>
                </Grid>
                {sections.find((section) => section.name === "Bridge")?.parts?.map((part, i) => (
                    <Grid size={6}>
                        <GeneratorCard
                            onClick={() => handleBridge(part)}
                            image={part.thumb}
                            title={part.name} />
                    </Grid>
                ))}

            </>) : (<>
                <Grid size={12}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Selected Bridge: {bridge.name}
                    </Typography>
                </Grid>

            </>)) }

        
        </Grid>
    )

}

export default Step1;