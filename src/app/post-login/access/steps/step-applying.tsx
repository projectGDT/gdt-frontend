import FormDesigner from "@/components/form-designer";
import React, {useRef, useState} from "react";
import {AccessApplyPayload, ApplyingPolicy, Form} from "@/types";
import {Box, Button, Collapse, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {dict} from "@/i18n/zh-cn";

export default function StepApplying({current, setActiveStep}: {
    current: AccessApplyPayload
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}) {
    const formRef = useRef<Form>({
        title: "",
        preface: "",
        questions: []
    })
    const [applyingPolicy, setApplyingPolicy] = useState<ApplyingPolicy>("allOpen")
    const [formValid, setFormValid] = useState(false)

    return <>
        <RadioGroup
            onChange={(_event, value) => {
                const valueAsPolicy = value as ApplyingPolicy
                setApplyingPolicy(valueAsPolicy)
                current.applying.policy = valueAsPolicy
                current.applying.form = valueAsPolicy === "byForm" ? formRef.current : undefined
            }}
            defaultValue={"allOpen"}
            row
        >
            <FormControlLabel
                control={<Radio value={"allOpen"}/>}
                label={dict.access.applying.policy.allOpen}
            />
            <FormControlLabel
                control={<Radio value={"byForm"}/>}
                label={dict.access.applying.policy.byForm}
            />
        </RadioGroup>
        <Collapse in={applyingPolicy === "byForm"}>
            <FormDesigner
                current={formRef.current}
                setValid={setFormValid}
            />
        </Collapse>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                {dict.access.previous}
            </Button>
            <Button
                variant={"contained"}
                disabled={!(applyingPolicy === "allOpen" || formValid)}
                onClick={() => setActiveStep(step => step + 1)}
            >
                {dict.access.next}
            </Button>
        </Box>
    </>
}