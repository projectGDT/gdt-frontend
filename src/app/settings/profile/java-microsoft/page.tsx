"use client"

import {Alert, AlertTitle, Box, Button, Collapse, LinearProgress, Paper, Snackbar, Stack, TextField, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import React, {useRef, useState} from "react";
import {backendAddress, backendAddressWs, POST} from "@/utils";
import {useSessionStorage} from "usehooks-ts";
import Script from "next/script";
import { EventSourcePolyfill } from "event-source-polyfill";
import {io, Socket} from "socket.io-client";

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

    const [errorOpen, setErrorOpen] = useState(false)
    const [errorMsg, setErrMsg] = useState("")

    const [submitDisabled, setSubmitDisabled] = useState(false)

    const [loading, setLoading] = useState(false)

    const [showStep1, setShowStep1] = useState(false)
    const [userCode, setUserCode] = useState("")
    const [verificationUri, setVerificationUri] = useState("")

    const [showComplete, setShowComplete] = useState(false)
    const [uuid, setUUID] = useState("")
    const [playerName, setPlayerName] = useState("")

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
            <Typography variant={"h5"}>{dict.settings.profile.bind.javaMicrosoft.title}</Typography>
            <Button variant={"contained"} disabled={submitDisabled} onClick={async () => {
                setSubmitDisabled(true) // disable itself
                setLoading(true)

                const socket = io(
                    `${backendAddressWs}/post-login/profile/bind/java-microsoft`,
                    {
                        auth: {
                            token: jwt
                        }
                    }
                )

                socket.once("user-code", ({userCode: payloadUserCode, verificationUri: payloadVerificationUri}) => {
                    setUserCode(payloadUserCode)
                    setVerificationUri(payloadVerificationUri)
                    setShowStep1(true)
                })

                socket.once("success", ({uuid: payloadUUID, playerName: payloadPlayerName}) => {
                    setLoading(false)
                    setUUID(payloadUUID)
                    setPlayerName(payloadPlayerName)
                    setShowComplete(true)
                })

                socket.once("internal-error", () => {
                    setLoading(false)
                    setErrorOpen(true)
                    setErrMsg(dict.settings.profile.bind.javaMicrosoft.fail.internalError)
                })

                socket.once("timeout", () => {
                    setLoading(false)
                    setErrorOpen(true)
                    setErrMsg(dict.settings.profile.bind.javaMicrosoft.fail.timeout)
                })

                socket.once("already-exists", () => {
                    setLoading(false)
                    setErrorOpen(true)
                    setErrMsg(dict.settings.profile.bind.javaMicrosoft.fail.alreadyExists)
                })
            }}>{dict.settings.profile.bind.javaMicrosoft.submit}</Button>

            <Collapse in={loading} sx={{alignSelf: "stretch"}}>
                <LinearProgress sx={{marginX: "20%"}}/>
            </Collapse>

            <Collapse in={showStep1} sx={{alignSelf: "stretch"}}>
                <Paper elevation={2} sx={{marginX: "20%", padding: 1.5}}>
                    <Typography variant={"h6"}>{dict.settings.profile.bind.javaMicrosoft.step1.title}</Typography>
                    <Typography>
                        {dict.settings.profile.bind.javaMicrosoft.step1.content(`${verificationUri}?otc=${userCode}`)}
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
    </Box>
}