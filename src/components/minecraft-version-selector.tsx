// Component: Minecraft Version Selector
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectProps} from "@mui/material";
import {dict} from "@/i18n/zh-cn";

type CommonVersionSelectorProps = {
    fetchVersions: () => Promise<string[]>,
    setValid: Dispatch<SetStateAction<boolean>>,
    onCompatibleVersionsChange: (value: string[]) => void,
    onCoreVersionChange: (value: string) => void
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
                // 这里会产生一个 Warning: Received `false` for a non-boolean attribute `focused`.
                // 没找到怎么解决，对显示也没有影响，先放在这吧
            >{dict.access.remote.common.compatibleVersions.title}</InputLabel>
            <Select {...{
                error: error,
                focused: (error || success),
                multiple: true,
                labelId: "cpv-il",
                input: <OutlinedInput
                    label={dict.access.remote.common.compatibleVersions.title}
                    error={error}
                />,
                value: selectedVersions,
                onChange: ({target: {value}}, _child) => {
                    const isValid = value.length !== 0
                    setError(!isValid)
                    setSuccess(isValid)
                    props.setValid(isValid)

                    if (isValid) {
                        const valueAsArray = (typeof value === "string" ? [value] : value).sort(versionComparator)
                        setSelectedVersions(valueAsArray)
                        props.onCompatibleVersionsChange(valueAsArray)
                        setSelectedCoreVersion(valueAsArray[0])
                        props.onCoreVersionChange(valueAsArray[0])
                    }
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
                labelId: "crv-il",
                input: <OutlinedInput label={dict.access.remote.common.coreVersion}/>,
                value: selectedCoreVersion,
                onChange: ({target: {value}}, _child) => {
                    setSelectedCoreVersion(value)
                    props.onCoreVersionChange(value)
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