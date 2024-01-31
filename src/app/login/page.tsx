"use client"

import {
    Alert,
    Box,
    Button, Collapse,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useId, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useSessionStorage} from "usehooks-ts";

// cf验证码的轮子
import TurnstileInput from "turnstile-next/dist/esm/Input";
import { refreshTurnstile } from "turnstile-next/utils";

import {dict} from "@/i18n/zh-cn"

// @/utils 定义了一些常量和模板
import {backendAddress, POST} from "@/utils";

// 定义一种错误, 和网络错误区分开, 后面会有用
class IncorrectCredentialsError extends Error {
    constructor(props?: string | undefined) {
        super(props || undefined);
    }
}

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page() {
    const router = useRouter()
    const formRef = useRef()

    // React 中的 State, 一种可以在多次渲染之间暂存的变量, 详见文档
    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false)

    const [id, setId] = useSessionStorage("id", -1)
    const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [jwt, setJWT] = useSessionStorage("jwt", "")

    // 刷新Cloudflare验证码防止加载不出来
    useEffect(() => {refreshTurnstile();});

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <Box ml={20} sx={{
                display: "flex",
                flexDirection: "column",
                height: "25vh" // 用于指定相对尺寸, vh 是一个单位, 等于窗口高度或宽度除以 100
            }}>
                {/* 预存两个 Alert, 包含在 Collapse 中, 默认情况下是折叠的 */}
                <Collapse in={incorrectCredentialsOpen /* 指定控制 Alert 是否展示的变量 */}>
                    <Alert severity="error">{dict.login.fail.incorrectCredentials}</Alert>
                </Collapse>
                <Collapse in={networkErrorOpen}>
                    <Alert severity="error">{dict.login.fail.networkError}</Alert>
                </Collapse>
            </Box>

            <Box ml={20} component={"form"} ref={formRef}>
                {/* 单向纵向排布元素常用 Stack */}
                <Stack spacing={3} sx={{alignItems: "start"}}>
                    <Typography variant={"h4"}>{dict.login.title}</Typography>
                    <TextField
                        name={"username"}
                        label={dict.login.username}
                        variant={"outlined"}
                        sx={{width: "35vh"}}
                    />
                    <TextField
                        name={"password"}
                        label={dict.login.password}
                        type={"password"}
                        variant={"outlined"}
                        sx={{width: "35vh"}}
                    />
                    {/* cf验证码 */}
                    <TurnstileInput siteKey="0x4AAAAAAAQCzJ-tEMh00a-r" theme="light"></TurnstileInput>

                    <div>
                        <Button sx={{mr: 2}} variant={"contained"} size={"large"} onClick={() => {
                            // 重置两个 Alert 的状态
                            setNetworkErrorOpen(false)
                            setIncorrectCredentialsOpen(false)

                            // API 地址, 使用字符串模板拼接 backendAddress 和 path 而成
                            fetch(`${backendAddress}/login`, POST(
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
                                        throw new IncorrectCredentialsError()
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
                                    if (!(error instanceof IncorrectCredentialsError)) setNetworkErrorOpen(true)
                                })
                        }}>{dict.login.submit}</Button>
                        <Button
                            href="#text-buttons"
                            onClick={() => {router.push("/register")}}
                        >{dict.register.linkFromLoginPage}</Button>
                    </div>
                </Stack>
            </Box>
        </Box>
    )
}