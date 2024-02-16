"use client"

import {
    Alert,
    Box,
    Button,
    Snackbar,
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
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page() {
    const router = useRouter()
    const formRef = useRef()

    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)

    const [usernameValid, setUsernameValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [turnstilePassed, setTurnstilePassed] = useState(false)

    // 防止重复点击
    const [notClicked, setNotClicked] = useState(true);

    const [_jwt, setJWT] = useSessionStorage("jwt", "");

    return <>
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
            <ValidatorTextField
                name={"username"}
                frequency={"onChange"}
                label={dict.login.username.title}
                validator={inOrder({
                    validator: input => input !== "",
                    hint: dict.login.username.error.invalid
                })}
                setValid={setUsernameValid}
                sx={{width: 300}}
            />
            <ValidatorTextField
                name={"password"}
                type={"password"}
                frequency={"onChange"}
                label={dict.login.password.title}
                validator={inOrder({
                    validator: input => input !== "",
                    hint: dict.login.password.error.invalid
                })}
                setValid={setPasswordValid}
                sx={{width: 300}}
            />
            <Turnstile
                siteKey={"0x4AAAAAAAQCzJ-tEMh00a-r"} options={{theme: 'light'}}
                onSuccess={_token => setTurnstilePassed(true)}
                onError={() => setTurnstilePassed(false)}
                onExpire={() => setTurnstilePassed(false)}
            />

            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Button
                    variant={"contained"}
                    disabled={!(
                        usernameValid &&
                        passwordValid &&
                        turnstilePassed &&
                        notClicked
                    )}
                    onClick={() => {
                        setNotClicked(false)

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
                            setTimeout(() => {setNotClicked(true);}, 5000);
                            if (err === "incorrect-credentials")
                                setIncorrectCredentialsOpen(true)
                            else throw err
                        })
                    }}
                >{dict.login.submit}</Button>
                <Button
                    href="#text-buttons"
                    onClick={() => {router.push("/register")}}
                >{dict.register.title}</Button>
            </Box>
        </Box>
    </>


}