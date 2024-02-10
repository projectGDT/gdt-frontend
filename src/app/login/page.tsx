"use client"

import {
    Alert,
    Box,
    Button, Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

import {backendAddress, POST} from "@/utils";
import Script from "next/script";


export default function Page() {
    const router = useRouter()
    const formRef = useRef()

    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false)

    // const [id, setId] = useSessionStorage("id", -1)
    // const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    // 以上两个变量不再需要

    const [_jwt, setJWT] = useSessionStorage("jwt", "")

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        paddingX: "40%",
        flexGrow: 1
    }}>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1
        }}>
            <Box sx={{flexGrow: 1}}>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer/>

                <Snackbar open={incorrectCredentialsOpen}
                          autoHideDuration={5000}
                          onClose={() => {setIncorrectCredentialsOpen(false)}}
                          key={"ic"}>
                    <Alert severity={"error"} variant={"filled"}>{dict.login.fail.incorrectCredentials}</Alert>
                </Snackbar>
                <Snackbar open={networkErrorOpen}
                          autoHideDuration={5000}
                          onClose={() => {setNetworkErrorOpen(false)}}
                          key={"ne"}>
                    <Alert severity={"error"} variant={"filled"}>{dict.login.fail.networkError}</Alert>
                </Snackbar>
                <Box component={"form"} ref={formRef}
                     sx={{display: "flex", flexDirection: "column", gap: 2, textAlign: "center"}}>
                    <Typography variant={"h5"}>{dict.login.title}</Typography>
                    <TextField name={"username"} label={dict.login.username}/>
                    <TextField name={"password"} label={dict.login.password} type={"password"}/>
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAAAQCzJ-tEMh00a-r" data-theme="light"></div>
                    <Button variant={"contained"} onClick={() => {
                        // 重置两个 SnackBar 的状态
                        setNetworkErrorOpen(false)
                        setIncorrectCredentialsOpen(false)

                        // API 地址, 使用字符串模板拼接 backendAddress 和 path 而成
                        fetch(`${backendAddress}/login`, POST(
                            // 通过 FormData 构造普通对象, 进而以 Json 的形式发送
                            Object.fromEntries(new FormData(formRef.current).entries()),
                            false)
                        ).then(response => {
                            if (response.ok) return response.json()
                            else throw "incorrect-credentials"
                        }).then(({jwt}) => {
                            setJWT(jwt)
                            // 跳转回主页, 在 /list 写好之后可以考虑跳转到服务器选择页面
                            router.push("/")
                        }).catch(error => {
                            switch (error) {
                                case "incorrect-credentials":
                                    setIncorrectCredentialsOpen(true)
                                    break
                                default:
                                    setNetworkErrorOpen(true)
                            }
                        })
                    }}>{dict.login.submit}</Button>
                </Box>
            </Box>
        </Box>
    </Box>
}