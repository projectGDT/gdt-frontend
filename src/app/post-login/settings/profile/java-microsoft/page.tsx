"use client"

import {useSessionStorage} from "usehooks-ts";
import React, {useState} from "react";
import {
    Alert,
    Box,
    Button,
    Collapse,
    LinearProgress, Link,
    Paper,
    Snackbar,
    Typography
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import {io} from "socket.io-client";
import {backendAddress} from "@/utils";
import {JavaMsProfileButton} from "@/components/profile-display/java-ms-profile-button";

export default function Page() {
    const [jwt, _setJwt] = useSessionStorage("jwt", "")

    const [errorOpen, setErrorOpen] = useState(false)
    const [errorMsg, setErrMsg] = useState("")

    const [submitDisabled, setSubmitDisabled] = useState(false)

    const [loading, setLoading] = useState(false)

    const [showStep1, setShowStep1] = useState(false)
    const [userCode, setUserCode] = useState("")
    const [verificationUri, setVerificationUri] = useState("")

    const [completed, setCompleted] = useState(false)
    const [uuid, setUUID] = useState("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")
    const [playerName, setPlayerName] = useState("")

    return<Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <Snackbar open={errorOpen}
                  autoHideDuration={5000}
                  onClose={() => {setErrorOpen(false)}}
                  key={"ie"}>
            <Alert severity={"error"} variant={"filled"}>{errorMsg}</Alert>
        </Snackbar>

        <Box sx={{textAlign: "center"}}>
            <Typography variant={"h5"}>{dict.settings.profile.bind.javaMicrosoft.title}</Typography>
        </Box>
        <Button variant={"contained"} disabled={submitDisabled} sx={{alignSelf: "center"}} onClick={() => {
            setSubmitDisabled(true) // disable itself
            setLoading(true)

            const socket = io(
                `${backendAddress}/post-login/profile/bind/java-microsoft`,
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
                setCompleted(true)
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
        }}>{dict.settings.profile.bind.submit}</Button>

        <Collapse in={loading} sx={{alignSelf: "stretch"}}>
            <LinearProgress/>
        </Collapse>

        <Collapse in={showStep1} sx={{alignSelf: "stretch"}}>
            <Paper elevation={2} sx={{padding: 1.5}}>
                <Typography variant={"h6"}>{dict.settings.profile.bind.javaMicrosoft.step1.title}</Typography>
                <Typography>
                    {dict.settings.profile.bind.javaMicrosoft.step1.hint}
                    <br/>
                    <Link href={`${verificationUri}?otc=${userCode}`} target={"_blank"}>{`${verificationUri}?otc=${userCode}`}</Link>
                </Typography>
            </Paper>
        </Collapse>

        <Collapse in={completed} sx={{alignSelf: "stretch"}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Paper elevation={2} sx={{padding: 1.5}}>
                    <Typography variant={"h6"}>{dict.settings.profile.bind.javaMicrosoft.complete}</Typography>
                    <JavaMsProfileButton uuid={uuid} playerName={playerName}/>
                </Paper>
                <Button sx={{alignSelf: "center"}} href={"."}>
                    {dict.settings.profile.bind.goBack}
                </Button>
            </Box>
        </Collapse>
    </Box>
}