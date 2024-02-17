import React, {useState} from "react";
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";
import {dict} from "@/i18n/zh-cn";
import {Alert, Avatar, Box, Button, Collapse, Snackbar, Typography} from "@mui/material";
import Image from "next/image";

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&\/=]*)$/

export default function StepBasic({setActiveStep}: {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}) {
    const [nameValid, setNameValid] = useState(false)
    const [introductionValid, setIntroductionValid] = useState(false)
    const [logoSrc, setLogoSrc] = useState("")
    const [logoLinkValid, setLogoLinkValid] = useState(false)
    const [coverImage, setCoverImage] = useState(<></>)
    const [coverLinkValid, setCoverLinkValid] = useState(false)
    const [pictureLoadingErrorOpen, setPictureLoadingErrorOpen] = useState(false)

    return <>
        <ValidatorTextField
            name={"name"}
            label={dict.access.basic.name.title}
            validator={inOrder({
                validator: input => input.length >= 3 && input.length <= 30,
                hint: dict.access.basic.name.hint.invalidLength
            })}
            setValid={setNameValid}
        />
        <Box sx={{display: "flex", gap: 2}}>
            <ValidatorTextField
                name={"logoLink"}
                label={dict.access.basic.logoLink.title}
                validator={inOrder({
                    validator: input => urlRegex.test(input),
                    hint: dict.access.basic.logoLink.hint.invalid
                })}
                onValidationPass={setLogoSrc}
                setValid={setLogoLinkValid}
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
            name={"coverLink"}
            label={dict.access.basic.coverLink.title}
            validator={inOrder({
                validator: input => urlRegex.test(input),
                hint: dict.access.basic.coverLink.hint.invalid
            })}
            onValidationPass={inputSrc => setCoverImage(
                <Image
                    src={inputSrc}
                    alt={"Cover"}
                    fill
                    style={{objectFit: "cover"}}
                    onError={event => {
                        console.log(event)
                        setPictureLoadingErrorOpen(true)
                    }}
                />
            )}
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
        <ValidatorTextField
            multiline
            rows={10}
            label={dict.access.basic.introduction.title}
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
            defaultHelperText={dict.access.basic.introduction.hint.fallback}
        />
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