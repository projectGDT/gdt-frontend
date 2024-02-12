"use client"

import {
    Alert,
    Box,
    Button,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import React, {useRef, useState} from "react";
import {useRouter} from "next/navigation";

import { io } from "socket.io-client";

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

    // 防止重复点击
    const [notClicked, setNotClicked] = useState(true);

    // 验证信息
    const [emailAddr, setEmailAddr] = useState('');
    const [passkey, setPasskey] = useState('');
    const [showVerifyInfo, setShowVerifyInfo] = useState(false); // 是否展示验证信息
    const [completed, setCompleted] = useState(false); // 是否显示注册完成

    return (
        <Box sx={{display: "flex", flexDirection: "row", alignItems: "start"}}>
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
                            name={"invitationCode"}
                            label={dict.register.invitationCode}
                        />
                        {/* cf验证码 */}
                        <Turnstile siteKey="0x4AAAAAAAQCzJ-tEMh00a-r" options={{theme: 'light'}} />

                        <Button
                            variant={"contained"} size={"large"}
                            disabled={!(qidValidity && usernameValidity && passwordValidity && notClicked)}
                            onClick={() => {
                                // 重置Alert状态
                                setErrOpen(false);

                                // 禁用注册按钮
                                setNotClicked(false);

                                const socket = io( `${backendAddress}/register/submit`, {
                                    autoConnect: false
                                });

                                // 网络错误、注册信息错误、超时
                                socket.on("connect_error", (e) => {
                                    setErrMsg(dict.register.fail.networkError);
                                    setErrOpen(true);
                                    setTimeout(() => setNotClicked(true), 3000);
                                });
                                socket.on("payload_error", (e) => {
                                    // socket已由服务端关闭
                                    setErrMsg(dict.register.fail.invalidPayload);
                                    setErrOpen(true);
                                    setTimeout(() => setNotClicked(true), 3000);
                                });
                                socket.on("timeout_error", (e) => {
                                    setErrMsg(dict.register.fail.timeout);
                                    setErrOpen(true);
                                    setTimeout(() => setNotClicked(true), 3000);
                                });

                                // 显示验证信息
                                socket.on("pre-registered", (verifyInfo: {emailAddr: string, passkey: string}) => {
                                    setEmailAddr(verifyInfo.emailAddr);
                                    setPasskey(verifyInfo.passkey);
                                    setShowVerifyInfo(true);
                                });
                                
                                // 注册成功
                                socket.on("registered", (e) => {
                                    setCompleted(true);
                                    setTimeout(() => {
                                        router.push("/login");
                                    }, 5000);
                                });

                                // 连接并发送注册信息
                                socket.connect();
                                socket.emit("payload", Object.fromEntries(new FormData(formRef.current).entries()));
                            }}
                        >{dict.register.submit}</Button>
                    </Stack>
                </Box>
            </Box>
            <Box>
                {showVerifyInfo?
                    <Box ml={25} sx={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                        {completed?
                            <>
                                <Box ml={30} sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "30vh"
                                }}></Box>
                                <Stack spacing={4} sx={{alignItems: "start"}}>
                                    <Typography variant={"h3"}>{dict.register.verify.complete}</Typography>
                                    <Typography variant={"h5"}>{dict.register.verify.autoJump}</Typography>
                                </Stack>
                            </> : <>
                                <Box ml={20} sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "20vh"
                                }}></Box>
                                <Stack spacing={4} sx={{alignItems: "start"}}>
                                    <Typography variant={"h4"}>{dict.register.verify.title}</Typography>
                                    <Typography variant={"h6"}>{dict.register.verify.illustrate + emailAddr}</Typography>
                                    <Typography variant={"h6"}>{dict.register.verify.passkey + passkey}</Typography>
                                    <Typography variant={"h6"}>{dict.register.verify.hint}</Typography>
                                </Stack>
                            </>}
                    </Box>
                    : <></>}  {/* TODO: 这里加一张图片 */}
            </Box>
        </Box>
    )
}