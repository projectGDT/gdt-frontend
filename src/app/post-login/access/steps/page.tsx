"use client"

import React, {Fragment, useRef, useState} from "react";
import {Box, Button, Collapse, Paper, Step, StepLabel, Stepper, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import StepBasic from "@/app/post-login/access/steps/step-basic";
import StepRemote from "@/app/post-login/access/steps/step-remote";
import StepApplying from "@/app/post-login/access/steps/step-applying";
import {AccessApplyPayload} from "@/types";
import {useRouter} from "next/navigation";
import {backendAddress, POST} from "@/utils";
import AccessPayloadReviewer from "@/components/access-payload-reviewer";

export default function Page() {
    const router = useRouter()

    const payloadRef = useRef<AccessApplyPayload>({
        basic: {
            name: "",
            logoLink: "",
            coverLink: "",
            introduction: ""
        },
        remote: {
        },
        applying: {
            policy: "allOpen"
        }
    })

    const [activeStep, setActiveStep] = useState(0)

    const [submitClicked, setSubmitClicked] = useState(false)

    return <Paper sx={{display: "flex", flexDirection: "column", gap: 2, padding: 2}}>
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
                <StepBasic key={"basic"} current={payloadRef.current} setActiveStep={setActiveStep}/>,
                <StepRemote key={"remote"} current={payloadRef.current} setActiveStep={setActiveStep}/>,
                <StepApplying key={"applying"} current={payloadRef.current} setActiveStep={setActiveStep}/>,
                <Fragment key={"complete"}>
                    <Typography>{dict.access.finalConfirm}</Typography>
                    <AccessPayloadReviewer {...payloadRef.current}/>
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                            {dict.access.previous}
                        </Button>
                        <Button variant={"contained"} disabled={submitClicked} onClick={() => {
                            setSubmitClicked(true)
                            fetch(`${backendAddress}/post-login/access/submit`, POST(
                                payloadRef.current
                            )).then(_res => {
                                router.push(".")
                            })
                        }}>
                            {dict.access.complete}
                        </Button>
                    </Box>
                </Fragment>
            ].map((entry, index) => (
                <Collapse in={activeStep === index} key={index}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                        {entry}
                    </Box>
                </Collapse>
            ))}
        </Box>
    </Paper>
}