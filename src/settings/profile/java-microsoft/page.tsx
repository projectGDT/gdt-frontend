"use client"

import {Alert, AlertTitle, Box, Button, Collapse, LinearProgress, Paper, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import React, {useRef, useState} from "react";
import {backendAddress, POST} from "@/utils";
import {useSessionStorage} from "usehooks-ts";
import Script from "next/script";
import { EventSourcePolyfill } from "event-source-polyfill";

class EmptyCache {
    async getCached () {}
    async setCached (value: any) {}
    async setCachedPartial (value: any) {}
}

function emptyCacheFactory(object: any) {
    return new EmptyCache()
}

export default function Page() {
    const [jwt, _setJwt] = useSessionStorage("jwt", "")

    const [networkError, setNetworkError] = useState(false)
    const [internalError, setInternalError] = useState(false)

    const [submitDisabled, setSubmitDisabled] = useState(false)

    const [loading, setLoading] = useState(false)

    const [showStep1, setShowStep1] = useState(false)
    const [userCode, setUserCode] = useState("")
    const [redirectUri, setRedirectUri] = useState("")

    const [showComplete, setShowComplete] = useState(false)
    const [uuid, setUuid] = useState("")
    const [playerName, setPlayerName] = useState("")

    return <Box sx={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
        <Script src={"/eventsource.min.js"}/>

        <Snackbar open={internalError}
                  autoHideDuration={5000}
                  onClose={() => {setInternalError(false)}}
                  key={"ie"}>
            <Alert severity={"error"} variant={"filled"}>{dict.settings.profile.bind.javaMicrosoft.fail.internalError}</Alert>
        </Snackbar>

        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "15vh"
        }}></Box>

        <Stack spacing={2} sx={{alignItems: "center", width: "100%"}}>
            <Typography variant={"h5"}>{dict.settings.profile.bind.javaMicrosoft.title}</Typography>
            <Button variant={"contained"} disabled={submitDisabled} onClick={async () => {
                setSubmitDisabled(true) // disable itself
                setLoading(true)

                const session = new EventSourcePolyfill(
                    `${backendAddress}/post-login/profile/bind/java-microsoft`,
                    {
                        headers: {
                            "Authorization": `Bearer ${jwt}`
                        }
                    }
                )

                session.addEventListener("message", event => {
                    const body = JSON.parse(event.data)
                    if ("userCode" in body && "redirectUri" in body) {
                        setUserCode(body["userCode"])
                        setRedirectUri(body["redirectUri"])
                        setShowStep1(true)
                    }
                    if ("success" in body) {
                        setLoading(false)
                        if (body["success"]) {
                            setUuid(body["uuid"])
                            setPlayerName(body["playerName"])
                        } else {
                            setInternalError(true)
                        }
                    }
                })
            }}>{dict.settings.profile.bind.javaMicrosoft.submit}</Button>

            <Collapse in={loading} sx={{alignSelf: "stretch"}}>
                <LinearProgress sx={{marginX: "20%"}}/>
            </Collapse>

            <Collapse in={showStep1} sx={{alignSelf: "stretch"}}>
                <Paper elevation={2} sx={{marginX: "20%", padding: 1.5}}>
                    <Typography variant={"h6"}>{dict.settings.profile.bind.javaMicrosoft.step1.title}</Typography>
                    <Typography>
                        {dict.settings.profile.bind.javaMicrosoft.step1.content(`${redirectUri}?otc=${userCode}`)}
                    </Typography>
                </Paper>
            </Collapse>

            <Collapse in={showComplete} sx={{alignSelf: "stretch"}}>
                <Paper elevation={2} sx={{marginX: "20%", padding: 1.5}}>
                    <Typography variant={"h6"}>{dict.settings.profile.bind.javaMicrosoft.complete.title}</Typography>
                    <Typography>
                        {dict.settings.profile.bind.javaMicrosoft.complete.content(uuid, playerName)}
                    </Typography>
                </Paper>
            </Collapse>
        </Stack>

        <Box>

        </Box>
    </Box>
}