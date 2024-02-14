"use client"

import {
    Alert,
    Box,
    Button, LinearProgress, Paper,
    Snackbar,
    Step, StepLabel, Stepper,
    Typography
} from "@mui/material";
import React, {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import { io } from "socket.io-client";
import {dict} from "@/i18n/zh-cn"
import {backendAddress, GET} from "@/utils";
import { Turnstile } from "@marsidev/react-turnstile";
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";

const qidRegex = /^[1-9][0-9]{4,9}$/
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

export default function Page() {
    const router = useRouter();
    const formRef = useRef();

    const [activeStep, setActiveStep] = useState(0)

    // 警告 snackbar
    const [errMsg, setErrMsg] = useState('');
    const [errOpen, setErrOpen] = useState(false);

    const [qid, setQid] = useState("")

    // QQ 号用户名密码的合法性，同时为 true 注册按钮才可用
    const [qidValid, setQidValid] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    const [invitationCodeValid, setInvitationCodeValid] = useState(true);
    // 因为一开始邀请码为空，而空邀请码显然是合理的

    const [turnstilePassed, setTurnstilePassed] = useState(false)

    // 防止重复点击
    const [notClicked, setNotClicked] = useState(true);

    // 验证信息
    const [emailAddr, setEmailAddr] = useState('');
    const [passkey, setPasskey] = useState('');

    const steps = [
        <Box key={"submit"} component={"form"} ref={formRef} sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{display: "flex", gap: 2}}>
                <ValidatorTextField
                    name={"qid"}
                    label={dict.register.submit.qid.title}
                    validator={inOrder(
                        {
                            validator: input => qidRegex.test(input),
                            hint: dict.register.submit.qid.error.invalid
                        },
                        {
                            validator: input =>
                                fetch(`${backendAddress}/register/check-qid/${input}`, GET(false))
                                    .then(res => res.json())
                                    .then(body => Boolean(body.exists)),
                            hint: dict.register.submit.qid.error.alreadyExists
                        }
                    )}
                    onVerifyPass={input => setQid(input)}
                    setValid={setQidValid}
                    sx={{width: 0.5}}
                />
                <ValidatorTextField
                    name={"username"}
                    label={dict.register.submit.username.title}
                    validator={inOrder(
                        {
                            validator: input => usernameRegex.test(input),
                            hint: dict.register.submit.username.error.invalid
                        },
                        {
                            validator: input =>
                                fetch(`${backendAddress}/register/check-username/${input}`, GET(false))
                                    .then(res => res.json())
                                    .then(body => Boolean(body.exists)),
                            hint: dict.register.submit.qid.error.alreadyExists
                        }
                    )}
                    setValid={setUsernameValid}
                    sx={{width: 0.5}}
                />
            </Box>
            <ValidatorTextField
                name={"password"}
                label={dict.register.submit.password.title}
                validator={inOrder({
                    validator: input => passwordRegex.test(input),
                    hint: dict.register.submit.password.error.invalid
                })}
                setValid={setPasswordValid}
            />
            <Box sx={{display: "flex", gap: 2}}>
                <ValidatorTextField
                    name={"invitationCode"}
                    label={dict.register.submit.invitationCode.title}
                    validator={input => (input === "" || uuidRegex.test(input)) ? {
                        isValid: true
                    } : {
                        isValid: false,
                        hint: dict.register.submit.invitationCode.error.invalid
                    }}
                    setValid={setInvitationCodeValid}
                    sx={{flexGrow: 1}}
                />
                <Turnstile
                    siteKey="0x4AAAAAAAQCzJ-tEMh00a-r"
                    options={{theme: 'light'}}
                    onSuccess={_token => setTurnstilePassed(true)}
                    onError={() => setTurnstilePassed(false)}
                    onExpire={() => setTurnstilePassed(false)}
                />
                {/* Turnstile 啊，你让人操碎了心 */}
            </Box>
            <Button
                variant={"contained"} size={"large"}
                disabled={!(
                    qidValid &&
                    usernameValid &&
                    passwordValid &&
                    invitationCodeValid &&
                    turnstilePassed &&
                    notClicked
                )}
                onClick={() => {
                    // 禁用注册按钮
                    setNotClicked(false);

                    const socket = io( `${backendAddress}/register/submit`);

                    socket.on("invalid-payload", _event => {
                        setErrMsg(dict.register.submit.fail.invalidPayload);
                        setErrOpen(true);
                        setNotClicked(true)
                    });
                    socket.on("timeout", _event => {
                        setErrMsg(dict.register.submit.fail.timeout);
                        setErrOpen(true);
                        setNotClicked(true);
                    });

                    socket.on("pre-registered", ({emailAddr, passkey}) => {
                        setEmailAddr(emailAddr);
                        setPasskey(passkey);
                        setActiveStep(step => step + 1)
                    });

                    // 注册成功
                    socket.on("registered", _event => {
                        setActiveStep(step => step + 1)
                        setTimeout(() => {
                            router.push("/post-login/list");
                        }, 5000);
                    });

                    socket.emit("payload", Object.fromEntries(new FormData(formRef.current).entries()));
                }}
                sx={{alignSelf: "center"}}
            >{dict.register.submit.confirm}</Button>
        </Box>,
        <>
            <Typography>{dict.register.verify.content(emailAddr, passkey)}</Typography>
            <Typography>{dict.register.verify.hint(qid)}</Typography>

            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                <LinearProgress sx={{flexGrow: 1}}/>
                <Typography variant={"caption"}>{dict.register.verify.waiting}</Typography>
            </Box>
            <Button
                variant={"contained"}
                href={"https://mail.qq.com"}
                sx={{alignSelf: "center"}}
            >{dict.register.verify.go}</Button>
        </>,
        <Box key={"complete"} sx={{textAlign: "center"}}>
            <Typography variant={"h6"}>{dict.register.complete.title}</Typography>
            <Typography>{dict.register.complete.redirect}</Typography>
        </Box>
    ]

    return <Paper sx={{display: "flex", flexDirection: "column", gap: 2, padding: 2, flexGrow: 1}}>
        <Snackbar open={errOpen}
                  autoHideDuration={5000}
                  onClose={_event => setErrOpen(false)}>
            <Alert severity="error" variant="filled">{errMsg}</Alert>
        </Snackbar>

        <Stepper activeStep={activeStep} alternativeLabel>
            <Step key={"submit"}>
                <StepLabel>{dict.register.submit.label}</StepLabel>
            </Step>
            <Step key={"verify"}>
                <StepLabel>{dict.register.verify.label}</StepLabel>
            </Step>
        </Stepper>
        {steps[activeStep]}
    </Paper>
}