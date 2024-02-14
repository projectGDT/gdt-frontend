"use client"

import React, {useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    FormGroup,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import StepBasic from "@/app/post-login/access/steps/step-basic";
import StepRemote from "@/app/post-login/access/steps/step-remote";

export default function Page() {
    const [activeStep, setActiveStep] = useState(0)

    return <Box component={"form"}>
        <Paper sx={{display: "flex", flexDirection: "column", gap: 2, padding: 2}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                <Step key={"basic"}>
                    <StepLabel>{dict.access.steps.basic.title}</StepLabel>
                </Step>
                <Step key={"remote"}>
                    <StepLabel>{dict.access.steps.remote.title}</StepLabel>
                </Step>
                <Step key={"applying"}>
                    <StepLabel>{dict.access.steps.applying.title}</StepLabel>
                </Step>
            </Stepper>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                {[
                    <StepBasic key={"basic"} setActiveStep={setActiveStep}/>,
                    <StepRemote key={"remote"} setActiveStep={setActiveStep}/>,
                    <>
                        <Box sx={{display: "flex", flexDirection: "row-reverse", gap: 2}}>
                            <Button variant={"contained"} onClick={() => setActiveStep(step => step + 1)}>
                                {dict.access.steps.next}
                            </Button>
                            <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                                {dict.access.steps.previous}
                            </Button>
                        </Box>
                    </>,
                    <>
                        <Box sx={{display: "flex", flexDirection: "row-reverse", gap: 2}}>
                            <Button variant={"contained"} href={"."}>
                                {dict.access.steps.complete}
                            </Button>
                            <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                                {dict.access.steps.previous}
                            </Button>
                        </Box>
                    </>
                ].map((entry, index) => (
                    <Collapse in={activeStep === index} key={index}>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            {entry}
                        </Box>
                    </Collapse>
                ))}
            </Box>
        </Paper>
    </Box>
}