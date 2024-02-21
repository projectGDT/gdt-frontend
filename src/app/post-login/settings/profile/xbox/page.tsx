"use client"

import React, {useState} from "react";
import {Alert, Box, Button, Collapse, LinearProgress, Paper, Snackbar, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import {useSearchParams} from "next/navigation";
import {backendAddress, POST} from "@/utils";

import {XboxProfileButton} from "@/components/profile-display/xbox-profile-button";

export default function Page() {
    const params = useSearchParams()

    const [errorOpen, setErrorOpen] = useState(false)
    const [errorMsg, setErrMsg] = useState("")

    const [submitDisabled, setSubmitDisabled] = useState(false)

    const [loading, setLoading] = useState(false)

    const [showComplete, setShowComplete] = useState(false)
    const [xuid, setXUID] = useState("")
    const [xboxGamerTag, setXboxGamerTag] = useState("")

    return <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <Snackbar open={errorOpen}
                  autoHideDuration={5000}
                  onClose={() => {setErrorOpen(false)}}
                  key={"ie"}>
            <Alert severity={"error"} variant={"filled"}>{errorMsg}</Alert>
        </Snackbar>

        <Box sx={{textAlign: "center"}}>
            <Typography variant={"h5"}>{dict.settings.profile.bind.xbox.title}</Typography>
        </Box>
        <Button variant={"contained"} disabled={submitDisabled} sx={{alignSelf: "center"}} onClick={() => {
            setSubmitDisabled(true) // disable itself
            setLoading(true)

            fetch(`${backendAddress}/post-login/profile/bind/xbox`, POST({
                code: params.get("code")
            })).then(async res => {
                setLoading(false)
                if (!res.ok) throw await res.json().then(body => body.reason)
                else return res.json()
            }).then(({xuid, xboxGamerTag}) => {
                setXUID(xuid)
                setXboxGamerTag(xboxGamerTag)
                setShowComplete(true)
            }).catch(errMsg => {
                switch (errMsg) {
                    case "already-exists": {
                        setErrMsg(dict.settings.profile.bind.common.fail.alreadyExists)
                        break
                    }
                    case "internal-error": {
                        setErrMsg(dict.settings.profile.bind.xbox.fail.internalError)
                        break
                    }
                }
                setErrorOpen(true)
            })
        }}>{dict.settings.profile.bind.submit}</Button>

        <Collapse in={loading} sx={{alignSelf: "stretch"}}>
            <LinearProgress/>
        </Collapse>

        <Collapse in={showComplete} sx={{alignSelf: "stretch"}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Paper elevation={2} sx={{padding: 1.5}}>
                    <Typography variant={"h6"}>{dict.settings.profile.bind.xbox.complete}</Typography>
                    <XboxProfileButton xuid={xuid} gtg={xboxGamerTag}/>
                </Paper>
                <Button sx={{alignSelf: "center"}} href={"."}>
                    {dict.settings.profile.bind.goBack}
                </Button>
            </Box>
        </Collapse>
    </Box>
}