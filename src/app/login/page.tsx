"use client"

import {
    Alert,
    Box,
    Button,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import React, {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

// cf验证码的轮子
import { Turnstile } from "@marsidev/react-turnstile";

import {dict} from "@/i18n/zh-cn"

// @/utils 定义了一些常量和模板
import {backendAddress, POST} from "@/utils";

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page() {
    const router = useRouter()
    const formRef = useRef()

    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)

    const [disabled, setDisabled] = useState(false)
    // const [id, setId] = useSessionStorage("id", -1)
    // const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    // 以上两个变量不再需要
    const [_jwt, setJWT] = useSessionStorage("jwt", "")

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        flexGrow: 1
    }}>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1
        }}>
            <Box sx={{flexGrow: 1}}>
                <Snackbar
                    open={incorrectCredentialsOpen}
                    autoHideDuration={5000}
                    onClose={() => {setIncorrectCredentialsOpen(false)}}
                    key={"ic"}
                >
                    <Alert severity={"error"} variant={"filled"}>{dict.login.fail.incorrectCredentials}</Alert>
                </Snackbar>
                <Box
                    component={"form"}
                    ref={formRef}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        textAlign: "center"
                    }}
                >
                    <Typography variant={"h5"}>{dict.login.title}</Typography>
                    <TextField name={"username"} label={dict.login.username} sx={{width: 300}}/>
                    <TextField name={"password"} label={dict.login.password} type={"password"} sx={{width: 300}}/>
                    <Turnstile siteKey={"0x4AAAAAAAQCzJ-tEMh00a-r"} options={{theme: 'light'}}/>

                    <Box sx={{display: "flex", flexDirection: "row"}}>
                        <Button variant={"contained"} disabled={disabled} onClick={() => {
                            setDisabled(true)

                            // console.log(Object.fromEntries(new FormData(formRef.current).entries()))

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
                                router.push("/post-login/list")
                            }).catch(err => {
                                setTimeout(() => {setDisabled(false);}, 5000);
                                if (err === "incorrect-credentials")
                                    setIncorrectCredentialsOpen(true)
                                else throw err
                            })
                        }}>{dict.login.submit}</Button>
                        <Button
                            href="#text-buttons"
                            onClick={() => {router.push("/register")}}
                        >{dict.register.title}</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>
}