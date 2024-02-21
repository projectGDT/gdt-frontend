import React, {Fragment, useState} from "react";
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";
import {dict} from "@/i18n/zh-cn";
import {Alert, Avatar, Box, Button, Collapse, Paper, Snackbar, Typography} from "@mui/material";
import Image from "next/image";
import {AccessApplyPayload} from "@/types";
import MarkdownCustom from "@/components/markdown-custom";

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&\/=]*)$/

export default function StepBasic({current, setActiveStep}: {
    current: AccessApplyPayload
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}) {
    const [nameValid, setNameValid] = useState(false)
    const [introductionValid, setIntroductionValid] = useState(true)
    const [logoSrc, setLogoSrc] = useState("")
    const [logoLinkValid, setLogoLinkValid] = useState(false)
    const [coverImage, setCoverImage] = useState(<></>)
    const [coverLinkValid, setCoverLinkValid] = useState(false)
    const [pictureLoadingErrorOpen, setPictureLoadingErrorOpen] = useState(false)
    const [introductionRawText, setIntroductionRawText] = useState("")

    return <>
        <ValidatorTextField
            label={dict.access.basic.name.title}
            validator={inOrder({
                validator: input => input.length >= 3 && input.length <= 30,
                hint: dict.access.basic.name.hint.invalidLength
            })}
            setValid={setNameValid}
            onValidationPass={input => current.basic.name = input}
        />
        <Box sx={{display: "flex", gap: 2}}>
            <ValidatorTextField
                label={dict.access.basic.logoLink.title}
                validator={inOrder({
                    validator: input => urlRegex.test(input),
                    hint: dict.access.basic.logoLink.hint.invalid
                })}
                setValid={setLogoLinkValid}
                onValidationPass={input => {
                    setLogoSrc(input)
                    current.basic.logoLink = input
                }}
                defaultHelperText={dict.access.basic.logoLink.hint.fallback}
                sx={{flexGrow: 1}}
            />
            <Avatar variant={"rounded"} alt={"?"} src={logoSrc} sx={{
                height: 56, // 和 TextField 相同
                flexBasis: 56,
                flexGrow: 0, flexShrink: 0
            }}/>
        </Box>
        <ValidatorTextField
            label={dict.access.basic.coverLink.title}
            validator={inOrder({
                validator: input => urlRegex.test(input),
                hint: dict.access.basic.coverLink.hint.invalid
            })}
            onValidationPass={input => {
                setCoverImage(<Image
                    src={input}
                    alt={"Cover"}
                    fill
                    style={{objectFit: "cover"}}
                    onError={event => {
                        console.log(event)
                        setPictureLoadingErrorOpen(true)
                    }}
                />)
                current.basic.coverLink = input
            }}
            setValid={setCoverLinkValid}
            defaultHelperText={dict.access.basic.coverLink.hint.fallback}
        />
        <Snackbar
            key={"ple"}
            open={pictureLoadingErrorOpen}
            autoHideDuration={5000}
            onClose={() => setPictureLoadingErrorOpen(false)}
        >
            <Alert variant={"filled"} severity={"error"}>
                {dict.access.basic.coverLink.preview.error}
            </Alert>
        </Snackbar>
        <Collapse in={coverLinkValid}>
            <Typography variant={"body2"}>
                {dict.access.basic.coverLink.preview.title}
            </Typography>
            <Box sx={{aspectRatio: 16/9, position: "relative"}}>
                {coverImage}
            </Box>
            <Typography variant={"caption"}>
                {dict.access.basic.coverLink.preview.hint}
            </Typography>
        </Collapse>
        <Box sx={{display: "flex", gap: 2, alignItems: "start"}}>
            <ValidatorTextField
                multiline
                rows={25}
                label={dict.access.basic.introduction.title}
                frequency={"onChange"}
                InputProps={{
                    sx: {
                        fontFamily: [
                            '"JetBrains Mono Variable"',
                            '"Noto Sans SC Variable"',
                            'Monospace'
                        ]
                    }
                }}
                validator={inOrder({
                    validator: input => input.length <= 3000,
                    hint: dict.access.basic.introduction.hint.invalidLength
                })}
                setValid={setIntroductionValid}
                onValidationPass={input => {
                    setIntroductionRawText(input)
                    current.basic.introduction = input
                }}
                defaultHelperText={dict.access.basic.introduction.hint.fallback}
                sx={{width: 0.5}}
            />
            <Paper sx={{
                width: 0.5,
                overflow: "auto",
                height: 608, // 与文本框相同,
                paddingX: 2,
                paddingY: 1
            }}>
                <Typography sx={{width: "100%"}}>
                    <MarkdownCustom>
                        {introductionRawText}
                    </MarkdownCustom>
                </Typography>
            </Paper>
        </Box>
        <Box sx={{display: "flex", flexDirection: "row-reverse", gap: 2}}>
            <Button
                variant={"contained"}
                disabled={!(
                    nameValid &&
                    introductionValid &&
                    logoLinkValid &&
                    coverLinkValid
                )}
                onClick={() => setActiveStep(step => step + 1)}
            >
                {dict.access.next}
            </Button>
        </Box>
    </>
}