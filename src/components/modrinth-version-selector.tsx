import {
    Box,
    Collapse,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectProps
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import ValidatorTextField from "@/components/validator-text-field";
import {useState} from "react";
import ModList from "@/components/mod-list";

type ProjectMeta = {
    title: string,
    versions: string[]
} & any

export default function ModrinthVersionSelector() {
    const [versions, setVersions] = useState<string[]>([])
    const [selectedVersionId, setSelectedVersionId] = useState("")

    return <Box sx={{display: "flex", flexDirection: "column"}}>
        <Box sx={{display: "flex", gap: 2}}>
            <ValidatorTextField
                label={dict.access.remote.java.mod.project.title}
                validator={input => (
                    fetch(`https://api.modrinth.com/v2/project/${input}`).then(
                        res => res.ok ?
                            res.json() :
                            Promise.reject(res.status)
                    ).then(({title, versions}: ProjectMeta) => {
                        setVersions(versions)
                        setSelectedVersionId(versions[versions.length - 1]) // 最后一个版本是最新版本
                        return {
                            isValid: true,
                            hint: title
                        }
                    }).catch(err => {
                        setVersions([])
                        if (err === 404) {
                            return {
                                isValid: false,
                                hint: dict.access.remote.java.mod.project.hint.invalid
                            }
                        } else throw err
                    })
                )}
                setValid={_action => {}}
                sx={{width: 0.5}}
            />
            <FormControl sx={{width: 0.5}}>
                <InputLabel id={"jmvs-il"}>{dict.access.remote.java.mod.versionId}</InputLabel>
                <Select {...{
                    name: "java.modrinthVersionId",
                    labelId: "jmvs-il",
                    input: <OutlinedInput label={dict.access.remote.java.mod.versionId}/>,
                    value: selectedVersionId,
                    onChange: ({target: {value}}, _child) => {
                        setSelectedVersionId(value)
                    },
                    MenuProps: {
                        PaperProps: {
                            style: {
                                maxHeight: "20vh"
                            },
                        }
                    }
                } as SelectProps<string>}>
                    {versions.map(version => <MenuItem key={version} value={version}>
                        {version}
                    </MenuItem>)}
                </Select>
            </FormControl>
        </Box>
        <Collapse in={selectedVersionId !== ""}>
            {selectedVersionId === "" ?
                <></> : // load nothing
                <ModList versionId={selectedVersionId}/>
            }
        </Collapse>
    </Box>
}