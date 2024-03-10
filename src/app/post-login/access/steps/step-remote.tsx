import React, {useRef, useState} from "react";
import {
    Box,
    Button,
    Collapse,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup, Switch,
    Typography
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";
import MinecraftVersionSelector from "@/components/minecraft-version-selector";
import ModrinthVersionSelector from "@/components/modrinth-version-selector";

import {AccessApplyPayload, AccessApplyBedrockRemoteMeta, AccessApplyJavaRemoteMeta, JavaAuthType} from "@/types";

const domainOrIPv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/
const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/

type JEVersion = {
    id: string,
    type: string,
    url: string,
    time: string,
    releaseTime: string
}

type JEVersionMeta = {
    latest: {
        release: string,
        snapshot: string
    },
    versions: JEVersion[]
}

type BEVersion = [string, string, number]

export default function StepRemote({current, setActiveStep}: {
    current: AccessApplyPayload
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}) {
    const cachedJavaRef = useRef<AccessApplyJavaRemoteMeta>({
        address: "",
        port: 25565,
        compatibleVersions: [],
        coreVersion: "",
        auth: "microsoft"
    })
    const cachedBedrockRef = useRef<AccessApplyBedrockRemoteMeta>({
        address: "",
        port: 19132,
        compatibleVersions: [],
        coreVersion: ""
    })

    const [supportsJava, setSupportsJava] = useState(false)
    const [javaAddressValid, setJavaAddressValid] = useState(false)
    const [javaPortValid, setJavaPortValid] = useState(true)
    const [javaCompatibleVersionsValid, setJavaCompatibleVersionsValid] = useState(false)

    const [supportsBedrock, setSupportsBedrock] = useState(false)
    const [bedrockAddressValid, setBedrockAddressValid] = useState(false)
    const [bedrockPortValid, setBedrockPortValid] = useState(true)
    const [bedrockCompatibleVersionsValid, setBedrockCompatibleVersionsValid] = useState(false)

    function updateOuterJavaRef() {
        current.remote.java = cachedJavaRef.current
    }

    function updateOuterBedrockRef() {
        current.remote.bedrock = cachedBedrockRef.current
    }

    return <>
        <FormGroup row>
            <FormControlLabel control={<Switch
                onChange={(_event, checked) => {
                    current.remote.java = checked ?
                        {
                            ...cachedJavaRef.current,
                            ...supportsBedrock ? {
                                modpackVersionId: undefined
                            } : {}
                        } :
                        undefined // 设成 undefined 可以使 JSON.stringify 时不包含此项
                    setSupportsJava(checked)
                }}
            />} label={dict.access.remote.java.supports}/>
            <FormControlLabel control={<Switch
                name={"supportsBedrock"}
                onChange={(_event, checked) => {
                    current.remote.bedrock = checked ?
                        {
                            ...cachedBedrockRef.current,
                            ...supportsJava ? {
                                compatibleVersions: undefined,
                                coreVersion: undefined
                            } : {}
                        } :
                        undefined // 设成 undefined 可以使 JSON.stringify 时不包含此项
                    setSupportsBedrock(checked)
                }}
            />} label={dict.access.remote.bedrock.supports}/>
        </FormGroup>
        <Collapse in={supportsJava}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Box sx={{display: "flex", gap: 2}}>
                    <ValidatorTextField
                        name={"java.address"}
                        label={dict.access.remote.common.address.title}
                        validator={inOrder({
                            validator: input => domainOrIPv4Regex.test(input),
                            hint: dict.access.remote.common.address.hint.invalid
                        })}
                        setValid={setJavaAddressValid}
                        onValidationPass={input => {
                            cachedJavaRef.current.address = input
                            updateOuterJavaRef()
                        }}
                        defaultHelperText={dict.access.remote.common.address.hint.fallback}
                        sx={{width: 0.75}}
                    />
                    <ValidatorTextField
                        name={"java.port"}
                        label={dict.access.remote.common.port.title}
                        validator={inOrder(
                            {
                                validator: input => portRegex.test(input),
                                hint: dict.access.remote.common.port.hint.invalid
                            }
                        )}
                        setValid={setJavaPortValid}
                        onValidationPass={input => {
                            cachedJavaRef.current.port = parseInt(input)
                            updateOuterJavaRef()
                        }}
                        defaultValue={"25565"}
                        defaultHelperText={dict.access.remote.common.port.hint.fallback}
                        sx={{width: 0.25}}
                    />
                </Box>
                <MinecraftVersionSelector
                    fetchVersions={() => fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json", {method: "GET"})
                        .then(res => res.json())
                        .then(body => (body as JEVersionMeta).versions
                            .filter(version => version.type === "release")
                            .map(({id}) => id)
                        )
                    }
                    setValid={setJavaCompatibleVersionsValid}
                    onCompatibleVersionsChange={value => {
                        cachedJavaRef.current.compatibleVersions = value
                        updateOuterJavaRef()
                    }}
                    onCoreVersionChange={value => {
                        cachedJavaRef.current.coreVersion = value
                        updateOuterJavaRef()
                    }}
                />
                <RadioGroup
                    onChange={(_event, value) => {
                        cachedJavaRef.current.auth = value as JavaAuthType
                        updateOuterJavaRef()
                    }}
                    defaultValue={"microsoft"}
                    row
                >
                    <FormControlLabel
                        control={<Radio value={"microsoft"}/>}
                        label={dict.access.remote.java.auth.microsoft}
                    />
                    <FormControlLabel
                        control={<Radio value={"littleSkin"}/>}
                        label={dict.access.remote.java.auth.littleSkin}
                    />
                    <FormControlLabel
                        control={<Radio value={"offline"}/>}
                        label={dict.access.remote.java.auth.offline}
                    />
                </RadioGroup>
                <Typography variant={"body2"}>{dict.access.remote.java.mod.hint}</Typography>
                <Collapse in={!supportsBedrock && supportsJava}>
                    <ModrinthVersionSelector onChange={value => {
                        cachedJavaRef.current.modpackVersionId = value
                        updateOuterJavaRef()
                    }}/>
                </Collapse>
            </Box>
        </Collapse>
        <Collapse in={supportsBedrock}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Box sx={{display: "flex", gap: 2}}>
                    <ValidatorTextField
                        name={"bedrock.address"}
                        label={dict.access.remote.common.address.title}
                        validator={inOrder({
                            validator: input => domainOrIPv4Regex.test(input),
                            hint: dict.access.remote.common.address.hint.invalid
                        })}
                        setValid={setBedrockAddressValid}
                        onValidationPass={input => {
                            cachedBedrockRef.current.address = input
                            updateOuterBedrockRef()
                        }}
                        defaultHelperText={dict.access.remote.common.address.hint.fallback}
                        sx={{width: 0.75}}
                    />
                    <ValidatorTextField
                        name={"bedrock.port"}
                        label={dict.access.remote.common.port.title}
                        validator={inOrder(
                            {
                                validator: input => portRegex.test(input),
                                hint: dict.access.remote.common.port.hint.invalid
                            }
                        )}
                        setValid={setBedrockPortValid}
                        onValidationPass={input => {
                            cachedBedrockRef.current.port = parseInt(input)
                            updateOuterBedrockRef()
                        }}
                        defaultValue={"19132"}
                        defaultHelperText={dict.access.remote.common.port.hint.fallback}
                        sx={{width: 0.25}}
                    />
                </Box>
                <Collapse in={supportsBedrock && !supportsJava} mountOnEnter={true} unmountOnExit={false}>
                    <MinecraftVersionSelector
                        fetchVersions={() => fetch(
                            "https://mirror.ghproxy.com/https://raw.githubusercontent.com/MCMrARM/mc-w10-versiondb/master/versions.json.min",
                            // Minecraft 基岩版的版本列表获取高度依赖社区，此内容托管在 GitHub 上。
                            // 众所周知，GitHub 在国内的连通性不佳，后期可能由用户自行指定镜像源。
                            {method: "GET"})
                            .then(res => res.json())
                            .then(body => (body as BEVersion[])
                                .filter(version => version[2] === 0)
                                .map(versionObj => versionObj[0])
                                .map(str => str.slice(0, str.lastIndexOf(".")))
                            )
                        }
                        setValid={setBedrockCompatibleVersionsValid}
                        onCompatibleVersionsChange={value => {
                            cachedBedrockRef.current.compatibleVersions = value
                            updateOuterBedrockRef()
                        }}
                        onCoreVersionChange={value => {
                            cachedBedrockRef.current.coreVersion = value
                            updateOuterBedrockRef()
                        }}
                    />
                </Collapse>
            </Box>
        </Collapse>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                {dict.access.previous}
            </Button>
            <Button
                variant={"contained"}
                disabled={!(
                    (
                        (supportsJava && !supportsBedrock) && (
                            javaAddressValid && javaPortValid && javaCompatibleVersionsValid
                        )
                    ) || (
                        (!supportsJava && supportsBedrock) && (
                            bedrockAddressValid && bedrockPortValid && bedrockCompatibleVersionsValid
                        )
                    ) || (
                        (supportsJava && supportsBedrock) && (
                            javaAddressValid && javaPortValid && javaCompatibleVersionsValid &&
                            bedrockAddressValid && bedrockPortValid
                        )
                    )
                )}
                onClick={() => setActiveStep(step => step + 1)}
            >
                {dict.access.next}
            </Button>
        </Box>
    </>
}