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

// @/templates 定义了一些常量和模板
import {backendAddress, POST} from "@/utils";
import Script from "next/script";

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

    const [_id, setId] = useSessionStorage("id", -1)
    const [_isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [_jwt, setJWT] = useSessionStorage("jwt", "")

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {/* 引入 Cloudflare Turnstile */}
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer/>

            <Snackbar
                open={incorrectCredentialsOpen}
                autoHideDuration={5000}
                onClose={() => {setIncorrectCredentialsOpen(false)}}
                key={"ic"}
            >
                <Alert severity={"error"} variant={"filled"}>{dict.login.fail.incorrectCredentials}</Alert>
            </Snackbar>
            <Snackbar
                open={networkErrorOpen}
                autoHideDuration={5000}
                onClose={() => {setNetworkErrorOpen(false)}}
                key={"ne"}
            >
                <Alert severity={"error"} variant={"filled"}>{dict.login.fail.networkError}</Alert>
            </Snackbar>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "25vh"
            }}></Box>

            <Box component={"form"} ref={formRef}>
                {/* 单向纵向排布元素常用 Stack */}
                <Stack spacing={2} sx={{alignItems: "center"}}>
                    <Typography variant={"h5"}>{dict.login.title}</Typography>
                    <TextField name={"username"}
                               label={dict.login.username} variant={"outlined"} sx={{width: "35vh"}}/>
                    <TextField name={"password"}
                               label={dict.login.password} type={"password"} variant={"outlined"} sx={{width: "35vh"}}/>
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAAAQCzJ-tEMh00a-r" data-theme="light"></div>
                    {/* 这个元素会向 FormData 中注入一个名为 cf-turnstile-response 的属性 */}

                    <Button variant={"contained"} onClick={() => {
                        // 重置两个 SnackBar 的状态
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
                </Stack>
            </Box>
        </Box>
    )
}