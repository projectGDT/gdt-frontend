"use client"

import {
    Alert,
    Box,
    Button,
    Snackbar,
    Stack,
    TextField,
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

// 定义一种错误, 和网络错误区分开, 后面会有用
class InvalidInfoError extends Error {
    constructor(props?: string | undefined) {
        super(props || undefined);
    }
}

// 注册页面
export default function Page() {
    const router = useRouter();
    const formRef = useRef();

    // 两个警告snackbar的显示状态
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false);
    const [invalidInfoErrorOpen, setInvalidInfoErrorOpen] = useState(false);
    const handleNetworkErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNetworkErrorOpen(false);
    }
    const handleInvalidInfoErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setInvalidInfoErrorOpen(false);
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

            <Snackbar open={networkErrorOpen} autoHideDuration={3000} onClose={handleNetworkErrorClose}>
                <Alert severity="error" variant="filled">{dict.register.fail.networkError}</Alert>
            </Snackbar>
            <Snackbar open={invalidInfoErrorOpen} autoHideDuration={3000} onClose={handleInvalidInfoErrorClose}>
                <Alert severity="error" variant="filled">{dict.register.fail.invalidInfoError}</Alert>
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
                            setNetworkErrorOpen(false);
                            setInvalidInfoErrorOpen(false);

                            fetch(`${backendAddress}/register/submit`, POST(Object.fromEntries(new FormData(formRef.current).entries()),false))
                                .then(response => {
                                    if (response.ok) {
                                        return response.json();
                                    }
                                    // 后端检查发现注册信息不合法
                                    throw new InvalidInfoError();
                                })
                                .then((json: any) => {
                                    // 重定向，并将passkey和emailAddr传递到finish页面
                                    sessionStorage.setItem('emailAddr', json['emailAddr']);
                                    sessionStorage.setItem('passkey', json['passkey']);
                                    router.push("/register/finish");
                                })
                                .catch(error => {
                                    if (error instanceof InvalidInfoError) {
                                        setInvalidInfoErrorOpen(true);
                                    } else {
                                        setNetworkErrorOpen(true);
                                    }
                                });
                        }}
                    >{dict.register.submit}</Button>
                </Stack>
            </Box>
        </Box>
    )
}