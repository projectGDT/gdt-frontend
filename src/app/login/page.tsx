"use client"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    Alert,
    Box,
    Button, Collapse,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

// @/templates 定义了一些常量和模板
import {backendAddress, POST} from "@/templates";

// 定义一种错误, 和网络错误区分开, 后面会有用
class IncorrectCredentialsError extends Error {
    constructor(props?: string | undefined) {
        super(props || undefined);
    }
}

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page() {
    const router = useRouter()

    // React 中的 State, 一种可以在多次渲染之间暂存的变量, 详见文档
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false)

    // sessionStorage, 浏览器原生特性, 能储存一些全局变量
    // usehooks-ts 提供的特性, 能在 Next 中安全地使用 sessionStorage (否则编译会报错, 虽然不影响正常使用)
    const [id, setId] = useSessionStorage("id", "-1")
    const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [jwt, setJWT] = useSessionStorage("jwt", "")

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "25vh" // 用于指定相对尺寸, vh 是一个单位, 等于窗口高度或宽度除以 100
            }}>
                {/* 两个 Alert, 包含在 Collapse 中, 默认情况下是折叠的 */}
                <Collapse in={incorrectCredentialsOpen /* 指定控制 Alert 是否展示的变量 */}>
                    <Alert severity="error">{dict.login.fail.incorrectCredentials}</Alert>
                </Collapse>
                <Collapse in={networkErrorOpen}>
                    <Alert severity="error">{dict.login.fail.networkError}</Alert>
                </Collapse>
            </Box>

            {/* 单向纵向排布元素常用 Stack */}
            <Stack spacing={2} sx={{ alignItems: "center" }}>
                <Typography variant={"h5"}>{dict.login.title}</Typography>
                <TextField
                    label={dict.login.username}
                    variant={"outlined"}
                    sx={{width: "35vh"}}
                    onChange={
                        event => setUsername(event.target.value)
                        // 一种很唐的获取文本框内容的方法
                        // 因为这个 TextField 本身不是一个可访问的域, 只能在用户每次更改内容的时候更改外部定义 State
                    }
                />
                <TextField
                    label={dict.login.password}
                    type={"password"}
                    variant={"outlined"}
                    sx={{width: "35vh"}}
                    onChange={event => setPassword(event.target.value)}
                />
                <Button variant={"contained"} onClick={() => {
                    // 重置两个 Alert 的状态
                    setNetworkErrorOpen(false)
                    setIncorrectCredentialsOpen(false)

                    // API 地址, 使用字符串模板拼接 backendAddress 和 path 而成
                    fetch(`${backendAddress}/login`, POST({
                        username: username,
                        password: password
                    }, false))
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
    )
}