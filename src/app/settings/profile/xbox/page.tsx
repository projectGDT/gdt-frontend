"use client"

import React, {useState} from "react";
import {Alert, Box, Button, Collapse, LinearProgress, Paper, Snackbar, Stack, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import {useSearchParams} from "next/navigation";
import {backendAddress, POST} from "@/utils";

export default function Page() {
    const params = useSearchParams()

    const [errorOpen, setErrorOpen] = useState(false)
    const [errorMsg, setErrMsg] = useState("")

    const [submitDisabled, setSubmitDisabled] = useState(false)

    const [loading, setLoading] = useState(false)

    const [showComplete, setShowComplete] = useState(false)
    const [xuid, setXUID] = useState("")
    const [xboxGamerTag, setXboxGamerTag] = useState("")

    return <Box sx={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
        <Snackbar open={errorOpen}
                  autoHideDuration={5000}
                  onClose={() => {setErrorOpen(false)}}
                  key={"ie"}>
            <Alert severity={"error"} variant={"filled"}>{errorMsg}</Alert>
        </Snackbar>

        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "15vh"
        }}></Box>

        <Stack spacing={2} sx={{alignItems: "center", width: "100%"}}>
            <Typography variant={"h5"}>{dict.settings.profile.bind.xbox.title}</Typography>
            <Button variant={"contained"} disabled={submitDisabled} onClick={() => {
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
                            setErrMsg(dict.settings.profile.bind.xbox.fail.alreadyExists)
                            break
                        }
                        case "internal-error": {
                            setErrMsg(dict.settings.profile.bind.xbox.fail.internalError)
                            break
                        }
                    }
                    setErrorOpen(true)
                })
            }}>{dict.settings.profile.bind.xbox.submit}</Button>

            <Collapse in={loading} sx={{alignSelf: "stretch"}}>
                <LinearProgress sx={{marginX: "20%"}}/>
            </Collapse>

            <Collapse in={showComplete} sx={{alignSelf: "stretch"}}>
                <Paper elevation={2} sx={{marginX: "20%", padding: 1.5}}>
                    <Typography variant={"h6"}>{dict.settings.profile.bind.xbox.complete.title}</Typography>
                    <Typography>
                        {dict.settings.profile.bind.xbox.complete.content(xuid, xboxGamerTag)}
                    </Typography>
                </Paper>
            </Collapse>
        </Stack>
    </Box>
}