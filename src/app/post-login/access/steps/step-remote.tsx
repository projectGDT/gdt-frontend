import React, {useState} from "react";
import {Box, Button, Checkbox, Collapse, FormControlLabel, FormGroup, TextField, Typography} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";
import MinecraftVersionSelector from "@/components/minecraft-version-selector";
import ModrinthVersionSelector from "@/components/modrinth-version-selector";

const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
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

export default function StepRemote({setActiveStep}: {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}) {
    const [supportsJava, setSupportsJava] = useState(false)
    const [javaAddressValid, setJavaAddressValid] = useState(false)
    const [javaPortValid, setJavaPortValid] = useState(true)
    const [javaCompatibleVersionsValid, setJavaCompatibleVersionsValid] = useState(false)

    const [supportsBedrock, setSupportsBedrock] = useState(false)
    const [bedrockAddressValid, setBedrockAddressValid] = useState(false)
    const [bedrockPortValid, setBedrockPortValid] = useState(true)
    const [bedrockCompatibleVersionsValid, setBedrockCompatibleVersionsValid] = useState(false)

    return <>
        <FormGroup>
            <FormControlLabel control={<Checkbox
                name={"supportsJava"}
                onChange={event => {
                    setSupportsJava(event.target.checked)
                }}
            />} label={dict.access.steps.remote.java.supports}/>
            <Collapse in={supportsJava}>
                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <Box sx={{display: "flex", gap: 2}}>
                        <ValidatorTextField
                            name={"java.address"}
                            label={dict.access.steps.remote.common.address.title}
                            validator={inOrder({
                                validator: input => domainRegex.test(input),
                                hint: dict.access.steps.remote.common.address.hint.invalid
                            })}
                            setValid={setJavaAddressValid}
                            defaultHelperText={dict.access.steps.remote.common.address.hint.fallback}
                            sx={{width: 0.75}}
                        />
                        <ValidatorTextField
                            name={"java.port"}
                            label={dict.access.steps.remote.common.port.title}
                            validator={inOrder(
                                {
                                    validator: input => portRegex.test(input),
                                    hint: dict.access.steps.remote.common.port.hint.invalid
                                }
                            )}
                            setValid={setJavaPortValid}
                            defaultValue={"25565"}
                            defaultHelperText={dict.access.steps.remote.common.port.hint.fallback}
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
                        compatibleVersionsInputName={"java.compatibleVersions"}
                        coreVersionInputName={"java.coreVersion"}
                        setCompatibleVersionsValid={setJavaCompatibleVersionsValid}
                    />
                    <Typography variant={"body2"}>{dict.access.steps.remote.java.mod.hint}</Typography>
                    <Collapse in={!supportsBedrock && supportsJava}>
                        <ModrinthVersionSelector/>
                    </Collapse>
                </Box>
            </Collapse>
            <FormControlLabel control={<Checkbox
                name={"supportsBedrock"}
                onChange={event => {
                    setSupportsBedrock(event.target.checked)
                }}
            />} label={dict.access.steps.remote.bedrock.supports}/>
            <Collapse in={supportsBedrock}>
                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <Box sx={{display: "flex", gap: 2}}>
                        <ValidatorTextField
                            name={"bedrock.address"}
                            label={dict.access.steps.remote.common.address.title}
                            validator={inOrder({
                                validator: input => domainRegex.test(input),
                                hint: dict.access.steps.remote.common.address.hint.invalid
                            })}
                            setValid={setBedrockAddressValid}
                            defaultHelperText={dict.access.steps.remote.common.address.hint.fallback}
                            sx={{width: 0.75}}
                        />
                        <ValidatorTextField
                            name={"bedrock.port"}
                            label={dict.access.steps.remote.common.port.title}
                            validator={inOrder(
                                {
                                    validator: input => portRegex.test(input),
                                    hint: dict.access.steps.remote.common.port.hint.invalid
                                }
                            )}
                            setValid={setBedrockPortValid}
                            defaultValue={"19132"}
                            defaultHelperText={dict.access.steps.remote.common.port.hint.fallback}
                            sx={{width: 0.25}}
                        />
                    </Box>
                    <Collapse in={supportsBedrock && !supportsJava}>
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
                            compatibleVersionsInputName={"bedrock.compatibleVersions"}
                            coreVersionInputName={"bedrock.coreVersion"}
                            setCompatibleVersionsValid={setBedrockCompatibleVersionsValid}
                        />
                    </Collapse>
                </Box>
            </Collapse>
        </FormGroup>
        <Box sx={{display: "flex", flexDirection: "row-reverse", gap: 2}}>
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
                onClick={() => setActiveStep(step => step + 1)}>
                {dict.access.steps.next}
            </Button>
            <Button variant={"outlined"} onClick={() => setActiveStep(step => step - 1)}>
                {dict.access.steps.previous}
            </Button>
        </Box>
    </>
}