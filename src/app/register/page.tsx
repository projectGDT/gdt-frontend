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

// 注册页面
export default function Page() {
    const router = useRouter()
    const formRef = useRef()

    // React 中的 State, 一种可以在多次渲染之间暂存的变量, 详见文档
    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false)

    const [id, setId] = useSessionStorage("id", -1)
    const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [jwt, setJWT] = useSessionStorage("jwt", "")

    const [password, setPassword] = useState('');  // 用于和确认密码进行比较

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {/* 引入 Cloudflare Turnstile */}
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer/>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "25vh" // 用于指定相对尺寸, vh 是一个单位, 等于窗口高度或宽度除以 100
            }}>
                {/* 预存两个 Alert, 包含在 Collapse 中, 默认情况下是折叠的 */}
                <Collapse in={incorrectCredentialsOpen /* 指定控制 Alert 是否展示的变量 */}>
                    {/* <Alert severity="error">{dict.login.fail.incorrectCredentials}</Alert> */}
                </Collapse>
                <Collapse in={networkErrorOpen}>
                    {/* <Alert severity="error">{dict.login.fail.networkError}</Alert> */}
                </Collapse>
            </Box>

            <Box component={"form"} ref={formRef}>
                {/* 单向纵向排布元素常用 Stack */}
                <Stack spacing={2} sx={{alignItems: "center"}}>
                    <Typography variant={"h5"}>{dict.register.title}</Typography>
                    <InputBox
                        name={"qid"}
                        label={dict.register.qid}
                        validator={validateQid}
                    />
                    <InputBox
                        name={"username"}
                        label={dict.register.username}
                        // validator={validateUsername}
                    />
                    <InputBox
                        name={"password"}
                        label={dict.register.password}
                        isPassword={true}
                        // validator={validatePassword}
                    />
                    <InputBox
                        name={"inviteCode"}
                        label={dict.register.inviteCode}
                    />
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAAAQCzJ-tEMh00a-r" data-theme="light"></div>
                    {/* 这个元素会向 FormData 中注入一个名为 cf-turnstile-response 的属性 */}

                    <Button variant={"contained"} onClick={() => {
                        // 重置两个 Alert 的状态
                        setNetworkErrorOpen(false)
                        setIncorrectCredentialsOpen(false)

                        // API 地址, 使用字符串模板拼接 backendAddress 和 path 而成
                        fetch(`${backendAddress}/register`, POST(
                            // 通过 FormData 构造普通对象, 进而以 Json 的形式发送
                            Object.fromEntries(new FormData(formRef.current).entries()),
                            false))
                            .then(response => {
                                if (response.ok) // 状态码是 2xx / 3xx
                                    return response.json() // 获取 response 的具体内容, 转化为 json, 并传递给下一个层级
                                else {
                                    // 后端返回了内容, 但状态码不是 2xx / 3xx, 显示 "IncorrectCredentials" Alert
                                    setIncorrectCredentialsOpen(true)
                                    // 及时中止响应, 抛出的错误被最后的 catch 捕获
                                    // throw new IncorrectCredentialsError()
                                }
                            })
                            .then(({id, isSiteAdmin, jwt}) => {
                                // 设置 id 等全局变量
                                setId(id)
                                setIsSiteAdmin(isSiteAdmin)
                                setJWT(jwt)
                                // 跳转回主页, 在 /list 写好之后可以考虑跳转到服务器选择页面
                                router.push("/")
                            })
                            .catch(error => {
                                // if (error instanceof IncorrectCredentialsError)
                                //     那么这个错误是有关凭据的, 上面已经显示了相关 Alert
                                //     这里的 "NetworkError" Alert 就不再显示了
                                //     否则, 错误就是由网络故障引起的
                                // if (!(error instanceof IncorrectCredentialsError)) setNetworkErrorOpen(true)
                            })
                    }}>{dict.register.submit}</Button>
                </Stack>
            </Box>
        </Box>
    )
}