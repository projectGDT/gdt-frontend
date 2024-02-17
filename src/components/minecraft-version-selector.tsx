// Component: Minecraft Version Selector
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectProps} from "@mui/material";
import {dict} from "@/i18n/zh-cn";

type CommonVersionSelectorProps = {
    fetchVersions: () => Promise<string[]>,
    compatibleVersionsInputName: string,
    coreVersionInputName: string,
    setCompatibleVersionsValid: Dispatch<SetStateAction<boolean>>
}

export default function MinecraftVersionSelector(props: CommonVersionSelectorProps) {
    const [versions, setVersions] = useState<string[]>([])
    const [selectedVersions, setSelectedVersions] = useState<string[]>([])
    const [selectedCoreVersion, setSelectedCoreVersion] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        props.fetchVersions().then(versions => setVersions(versions))
    }, [props]);

    return <Box sx={{display: "flex", gap: 2}}>
        <FormControl sx={{width: 0.5}}>
            <InputLabel
                id={"cpv-il"}
                color={error ? "error" : (success ? "success" : undefined)}
                focused={error || success}
            >{dict.access.remote.common.compatibleVersions.title}</InputLabel>
            <Select {...{
                name: props.compatibleVersionsInputName,
                error: error,
                focused: error || success,
                multiple: true,
                labelId: "cpv-il",
                input: <OutlinedInput
                    label={dict.access.remote.common.compatibleVersions.title}
                    error={error}
                />,
                value: selectedVersions,
                onChange: ({target: {value}}, _child) => {
                    const err = value.length === 0
                    setError(err)
                    setSuccess(!err)
                    props.setCompatibleVersionsValid(!err)
                    const valueAsArray = (typeof value === "string" ? [value] : value).sort(versionComparator)
                    setSelectedVersions(valueAsArray)
                    setSelectedCoreVersion(valueAsArray[0] ?? "")
                },
                renderValue: selected => <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                    {selected.map((version) => (
                        <Chip key={version} label={version}/>
                    ))}
                </Box>,
                MenuProps: {
                    slotProps: {
                        paper: {
                            style: {
                                maxHeight: "20vh"
                            },
                        }
                    }
                }
            } as SelectProps<string[]>}>
                {versions.map(version => <MenuItem key={version} value={version}>
                    {version}
                </MenuItem>)}
            </Select>
        </FormControl>
        <FormControl sx={{width: 0.5}}>
            <InputLabel id={"crv-il"}>{dict.access.remote.common.coreVersion}</InputLabel>
            <Select {...{
                name: props.coreVersionInputName,
                labelId: "crv-il",
                input: <OutlinedInput label={dict.access.remote.common.coreVersion}/>,
                value: selectedCoreVersion,
                onChange: ({target: {value}}, _child) => {
                    setSelectedCoreVersion(value)
                },
                MenuProps: {
                    slotProps: {
                        paper: {
                            style: {
                                maxHeight: "20vh"
                            },
                        }
                    }
                }
            } as SelectProps<string>}>
                {selectedVersions.map(version => <MenuItem key={version} value={version}>
                    {version}
                </MenuItem>)}
            </Select>
        </FormControl>
    </Box>
}

const versionComparator = (a: string, b: string) => {
    const toNumber = (version: string) => {
        const digitArray = version.split(".").map(entry => parseInt(entry))
        return digitArray[0] * 10000 * 1000 + digitArray[1] * 1000 + (digitArray[2] ?? 0)
        // 小版本号应该不会超过 1000
        // 我大 MC 万岁万岁万万岁，大版本更新一万个还不停休（好中二）
    }
    return toNumber(a) - toNumber(b)
}