"use client"

import {
    Alert,
    Box,
    Button, Collapse,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import React, {ReactElement, useEffect, useId, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

// @/templates 定义了一些常量和模板
import {backendAddress, GET, POST} from "@/utils";
import Script from "next/script";

import InputBox from "@/app/lib/inputbox";
import { validatePassword, validateQid, validateUsername } from "@/app/register/validate";

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

    const [networkErrorOpen, setNetworkErrorOpen] = useState(false);
    const [invalidInfoErrorOpen, setInvalidInfoErrorOpen] = useState(false);

    // 传递给finish页面
    const [emailAddr, setEmailAddr] = useSessionStorage('emailAddr', '');
    const [passkey, setPasskey] = useSessionStorage('passkey', '');

    // QQ号用户名密码的合法性，同时为true注册按钮才可用
    const [qidValidity, setQidValidity] = useState(false);
    const [usernameValidity, setUsernameValidity] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {/* 引入 Cloudflare Turnstile */}
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer/>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "25vh" // 用于指定相对尺寸, vh 是一个单位, 等于窗口高度或宽度除以 100
            }}>
                <Collapse in={networkErrorOpen}>
                    <Alert severity="error">{dict.register.fail.networkError}</Alert>
                </Collapse>
                <Collapse in={invalidInfoErrorOpen}>
                    <Alert severity="error">{dict.register.fail.invalidInfoError}</Alert>
                </Collapse>
            </Box>

            <Box component={"form"} ref={formRef}>
                {/* 单向纵向排布元素常用 Stack */}
                <Stack spacing={2} sx={{alignItems: "center"}}>
                    <Typography variant={"h5"}>{dict.register.title}</Typography>
                    <InputBox
                        name={"qid"}
                        label={dict.register.qid}
                        setValidity={setQidValidity}
                        validator={validateQid}
                    />
                    <InputBox
                        name={"username"}
                        label={dict.register.username}
                        setValidity={setUsernameValidity}
                        validator={validateUsername}
                    />
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
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAAAQCzJ-tEMh00a-r" data-theme="light"></div>
                    {/* 这个元素会向 FormData 中注入一个名为 cf-turnstile-response 的属性 */}

                    <Button
                        variant="contained"
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
                                    setEmailAddr(json['emailAddr']);
                                    setPasskey(json['passkey']);
                                    router.push("/register/finish");
                                })
                                .catch(error => {
                                    if (error instanceof InvalidInfoError) {
                                        setInvalidInfoErrorOpen(true);
                                    } else {
                                        setNetworkErrorOpen(true);
                                    }
                                })
                        }}
                    >{dict.register.submit}</Button>
                </Stack>
            </Box>
        </Box>
    )
}