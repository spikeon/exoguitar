import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import React, { ReactNode, useMemo, useState } from "react";
import { useGeneratorStateContext} from "../../contexts/generatorState/context";
import { GeneratorState, GuitarType, NeckType } from "../../types/State";
import Summary from "./summary";
import StepGuitarTypes from "./steps/StepGuitarTypes";
import StepBridges from "./steps/StepBridges";
import StepFacePlates from "./steps/StepFacePlates";
import StepHeads from "./steps/StepHeads";
import StepNecks from "./steps/StepNecks";
import StepNeckTypes from "./steps/StepNeckTypes";
import StepWingSets from "./steps/StepWingSets";

type step = {
    name: string
    component: ReactNode
    validator: (generatorState: GeneratorState) => boolean
}

const Generator = () => {
    const [activeStep, setActiveStep] = useState(0);

    const generatorState = useGeneratorStateContext();
    const {guitarType, neckType} = useMemo(() => generatorState, [generatorState]);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const steps: step[] = useMemo(() => {
        const currentSteps: step[] = [{
            name: "Guitar Type",
            component: (<StepGuitarTypes onComplete={handleNext} />),
            validator: ({guitarType}) => guitarType !== undefined
        }]

        if(guitarType === GuitarType.ELECTRIC){
            currentSteps.push({
                name: "Face Plate",
                component: (<StepFacePlates onComplete={handleNext} />),
                validator: ({facePlate}) => facePlate !== undefined
            })

            currentSteps.push({
                name: "Bridge",
                component: (<StepBridges onComplete={handleNext} />),
                validator: ({bridge}) => bridge !== undefined
            })
        }

        currentSteps.push({
            name: "Neck Type",
            component: (<StepNeckTypes onComplete={handleNext} />),
            validator: ({neckType}) => neckType !== undefined
        })

        if(neckType === NeckType.PRINTED) {
            currentSteps.push({
                name: "Neck",
                component: (<StepNecks onComplete={handleNext} />),
                validator: ({neck}) => neck !== undefined
            })
            currentSteps.push({
                name: "Head",
                component: (<StepHeads onComplete={handleNext} />),
                validator: ({head}) => head !== undefined
            })
        }

        currentSteps.push({
            name: "Wing Sets",
            component: (<StepWingSets onComplete={handleNext} />),
            validator: ({wingSet}) => wingSet !== undefined
        })

        return currentSteps;
    }, [guitarType, neckType]);

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Typography variant="h4" align="center" sx={{mb: 10, mt:10}}>
                    WARNING: THIS TOOL IS CURRENTLY UNDER ACTIVE DEVELOPMENT AND MAY NOT RETURN CORRECT VALUES.
                </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map(({name}, index) => {
                        const stepProps: { completed?: boolean } = {};
                        return (
                            <Step key={name} {...stepProps}>
                                <StepLabel>{name}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <Summary />
                ) : (
                    <Box sx={{width: "100%"}}>
                        {steps[activeStep].component}
                    </Box>
                )}
            </Box>
        </>
    )
}

export default Generator;