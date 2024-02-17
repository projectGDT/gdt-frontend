"use client"

import React, {useState} from "react";
import {
    Box,
    Button,
    Collapse,
    Paper,
    Step,
    StepLabel,
    Stepper
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import StepBasic from "@/app/post-login/access/steps/step-basic";
import StepRemote from "@/app/post-login/access/steps/step-remote";
import StepApplying from "@/app/post-login/access/steps/step-applying";

export default function Page() {
    const [activeStep, setActiveStep] = useState(2)

    return <Box component={"form"}>
        <Paper sx={{display: "flex", flexDirection: "column", gap: 2, padding: 2}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                <Step key={"basic"}>
                    <StepLabel>{dict.access.basic.title}</StepLabel>
                </Step>
                <Step key={"remote"}>
                    <StepLabel>{dict.access.remote.title}</StepLabel>
                </Step>
                <Step key={"applying"}>
                    <StepLabel>{dict.access.applying.title}</StepLabel>
                </Step>
            </Stepper>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                {[
                    <StepBasic key={"basic"} setActiveStep={setActiveStep}/>,
                    <StepRemote key={"remote"} setActiveStep={setActiveStep}/>,
                    <StepApplying key={"applying"}/>,
                    <>
                        <Box sx={{display: "flex", flexDirection: "row-reverse", gap: 2}}>
                            <Button variant={"contained"} href={"."}>
                                {dict.access.complete}
                            </Button>
                            <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                                {dict.access.previous}
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