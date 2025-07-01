import { Box, Stepper, Typography, Step, StepLabel, Button } from "@mui/material";
import React, { useMemo, useState } from "react";
import Step1 from "./step1";
import { useGeneratorStateContext, useGeneratorStateActionsContext } from "../../contexts/generatorState/context";
import { GuitarType } from "../../types/State";

    /*
    Page 1: Guitar Type
        - Accoustic or Electric
        - Electric: 
            - Which face plate
            - Which Bridge
    Page 2: Neck
        - Wooden or Printed
            - Wooden
                - Offset
            - Printed
                - Which Neck
                - Which Head
    Page 3: Wing Set
        - Choose Wing Set
    

    */

const steps = [
    "Guitar Type",
    "Neck",
    "Wing Set"
];

const Generator = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const {guitarType, bridge, facePlate, head, neck, wingSet} = useGeneratorStateContext();
    const {unsetGuitarType, unsetBridge, unsetFacePlate, unsetHead, unsetNeck, unsetWingSet} = useGeneratorStateActionsContext();


    const isStepOptional = (step: number) => {
      return false;
    };

    const isStepSkipped = (step: number) => {
      return skipped.has(step);
    };

    const handleNext = () => {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
    };

    const handleReset = () => {

      unsetBridge();
      unsetFacePlate();
      unsetGuitarType();
      unsetHead();
      unsetNeck();
      unsetFacePlate();
      unsetWingSet();

      setActiveStep(0);
    };

    const stepComplete = useMemo(() => {
        switch (steps[activeStep]){
            case "Guitar Type": 
                if(guitarType === undefined) return false;
                if(guitarType == GuitarType.ACCOUSTIC) return true;
                else {
                    if(!facePlate) return false;
                    if(!bridge) return false;
                }
        }
        return true;
    }, [guitarType, bridge, facePlate, head, neck, wingSet])

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                    optional?: React.ReactNode;
                } = {};
                if (isStepOptional(index)) {
                    labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                    );
                }
                if (isStepSkipped(index)) {
                    stepProps.completed = false;
                }
                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <>
                    
                    <Box sx={{width: "100%", minHeight: "50vh"}}>
                        { activeStep == 0 && (
                            <Step1 />
                        )}
                        { activeStep == 1 && (
                            <></>
                        )}
                        { activeStep == 2 && (
                            <></>
                        )}

                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        >
                        Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                            Skip
                        </Button>
                        )}
                        <Button 
                        disabled={!stepComplete}
                        onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default Generator;