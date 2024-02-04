"use client"

import {
    Alert,
    Box,
    Button,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import React, {ReactElement, useEffect, useId, useRef, useState} from "react";
import {useRouter} from "next/navigation";

import {dict} from "@/i18n/zh-cn"

// @/utils 定义了一些常量和模板
import {backendAddress, GET, POST} from "@/utils";
import InputBox from "@/components/inputbox";

import { validatePassword, validateQid, validateUsername } from "@/app/register/validate";

import { Turnstile } from "@marsidev/react-turnstile";

// 注册页面
export default function Page() {
    const router = useRouter();
    const formRef = useRef();

    // 警告snackbar
    const [errMsg, setErrMsg] = useState('');
    const [errOpen, setErrOpen] = useState(false);
    const handleErrClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrOpen(false);
    }

    // QQ号用户名密码的合法性，同时为true注册按钮才可用
    const [qidValidity, setQidValidity] = useState(false);
    const [usernameValidity, setUsernameValidity] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <Box ml={20} sx={{
                display: "flex",
                flexDirection: "column",
                height: "20vh" // 用于指定相对尺寸, vh 是一个单位, 等于窗口高度或宽度除以 100
            }}></Box>

            <Snackbar open={errOpen} autoHideDuration={3000} onClose={handleErrClose}>
                <Alert severity="error" variant="filled">{errMsg}</Alert>
            </Snackbar>

            <Box ml={20} component={"form"} ref={formRef}>
                {/* 单向纵向排布元素常用 Stack */}
                <Stack spacing={3} sx={{alignItems: "start"}}>
                    <Typography variant={"h4"}>{dict.register.title}</Typography>
                    <Box>
                        <InputBox
                            name={"qid"}
                            label={dict.register.qid}
                            sx={{width: "17vh", mr: "1vh"}}
                            setValidity={setQidValidity}
                            validator={validateQid}
                        />
                        <InputBox
                            name={"username"}
                            label={dict.register.username}
                            sx={{width: "17vh"}}
                            setValidity={setUsernameValidity}
                            validator={validateUsername}
                        />
                    </Box>
                    <InputBox
                        name={"password"}
                        label={dict.register.password}
                        setValidity={setPasswordValidity}
                        isPassword={true}
                        validator={validatePassword}
                    />
                    <InputBox
                        name={"inviteCode"}
                        label={dict.register.inviteCode}
                    />
                    {/* cf验证码 */}
                    <Turnstile siteKey="0x4AAAAAAAQCzJ-tEMh00a-r" options={{theme: 'light'}} />

                    <Button
                        variant={"contained"} size={"large"}
                        disabled={!(qidValidity && usernameValidity && passwordValidity)}
                        onClick={() => {
                            // 重置Alert状态
                            setErrOpen(false);

                            fetch(`${backendAddress}/register/submit`, POST(Object.fromEntries(new FormData(formRef.current).entries()),false))
                                .then(response => {
                                    if (response.ok || response.status === 400) {
                                        return response.json();
                                    }
                                    throw new Error(dict.register.fail.networkError);
                                })
                                .then(json => {
                                    switch (json["reason"]) {
                                        case "info-invalid":
                                            throw new Error(dict.register.fail.invalidInfoError);
                                        case "bad-captcha-response":
                                            throw new Error(dict.register.fail.invalidCaptcha);
                                        case "qid-exists":
                                            throw new Error(dict.register.qidError.alreadyExists);
                                        case "username-exists":
                                            throw new Error(dict.register.usernameError.alreadyExists);
                                        case "wrong-invitation-code":
                                            throw new Error(dict.register.fail.wrongInvitationCode);
                                    }
                                    // TODO: 注册确认阶段
                                })
                                .catch(e => {
                                    setErrMsg(e.message);
                                    setErrOpen(true);
                                });
                        }}
                    >{dict.register.submit}</Button>
                </Stack>
            </Box>
        </Box>
    )
}