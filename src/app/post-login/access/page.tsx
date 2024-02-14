"use client"

import {Box, Button, Checkbox, FormControlLabel, FormGroup, Paper, Stepper, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import {useState} from "react";

export default function Page() {
    const [confirmed, setConfirmed] = useState(false)

    return <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <Box sx={{textAlign: "center"}}>
            <Typography variant={"h5"}>{dict.access.title}</Typography>
        </Box>
        <Paper sx={{padding: 2}}>
            {dict.access.license}
        </Paper>
        <FormGroup>
            <FormControlLabel control={<Checkbox onChange={event => {
                setConfirmed(event.target.checked)
            }}/>} label={dict.access.confirm} />
        </FormGroup>
        <Button
            href={"access/steps"}
            variant={"contained"}
            disabled={!confirmed}
            sx={{alignSelf: "center"}}
        >{dict.access.go}</Button>
    </Box>
}