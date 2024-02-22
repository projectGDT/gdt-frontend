import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Skeleton,
    Typography,
} from "@mui/material";
import React, {useCallback, useEffect, useRef, useState} from "react";

import {dict} from "@/i18n/zh-cn"
import {Dependency, ModInfo} from "@/types";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";

const requestInit: RequestInit = {
    method: "GET",
    headers: {"User-Agent": "github.com/projectGDT (contact@gdt.pub)"},
    cache: "force-cache"
}

const iconFallback = "/mod_icon_fallback.png"

// 获取一个 mod 的完整信息
async function fetchModInfo(project_id: string, version_id: string, file_name: string): Promise<ModInfo> {
    // 如果是自己上传的文件（没有 project_id 和 version_id），就显示文件名
    if (!project_id || !version_id) {
        return {
            file_name: file_name,
            icon_url: iconFallback // 默认图标地址
        };
    }

    // 否则去 fetch
    const fetchProject = fetch(`https://api.modrinth.com/v2/project/${project_id}`, requestInit);
    const fetchVersion = fetch(`https://api.modrinth.com/v2/version/${version_id}`, requestInit);

    const [projectRes, versionRes] = await Promise.all([fetchProject, fetchVersion]);
    const [projectInfo, versionInfo] = await Promise.all([
        projectRes.ok ? projectRes.json() : Promise.reject(new Error(`HTTP ERROR, CODE: ${projectRes.status}`)),
        versionRes.ok ? versionRes.json() : Promise.reject(new Error(`HTTP ERROR, CODE: ${versionRes.status}`))
    ]);

    return {
        name: projectInfo.title,
        icon_url: projectInfo.icon_url ?? iconFallback,
        version_number: versionInfo.version_number
    };
}

export default function ModList({versionId, pageSize}: { versionId: string, pageSize?: number }) {
    // mod 图标的背景颜色
    const iconBgColor = '#e5e7eb';
    // 默认大小为一页 10 个
    const modPageSize = pageSize ?? 10;

    const [modInfo, setModInfo] = useState<ModInfo[]>([]); // 当前渲染的 mod 信息
    const [nowModPage, setNowModPage] = useState(0); // 当前在第几页
    const [loadingMods, setLoadingMods] = useState(true); // 是否在加载（获取信息）
    const dependencies = useRef<Dependency[]>([]); // 保存依赖信息

    // 加载第 idx 页 mods
    const loadPageOfMods = useCallback((idx: number) => {
        setLoadingMods(true);
        const lastModIdx = ((idx + 1) * modPageSize) > dependencies.current.length ? dependencies.current.length : ((idx + 1) * modPageSize);
        Promise.all(
            dependencies.current
                .slice(idx * modPageSize, lastModIdx)
                .map((item) => fetchModInfo(item.project_id, item.version_id, item.file_name))
        ).then(newData => {
            setModInfo(newData)
            setLoadingMods(false)
        })
    }, [modPageSize])

    // 获取 modpack 依赖信息，同时加载第一页内容
    useEffect(() => {
        setNowModPage(0)
        fetch(`https://api.modrinth.com/v2/version/${versionId}`, requestInit)
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    throw new Error(`${response.status}`);
            })
            .then(data => {
                dependencies.current = data.dependencies;
                loadPageOfMods(0);
            })
    }, [loadPageOfMods, versionId])

    return (<Box sx={{display: "flex", flexDirection: "column"}}>
        {loadingMods ?
            // Skeletons 组件，用于占位
            // gap 是为了消除 Skeleton 之间距离比 ListButtons 窄导致的伸缩，不知道是否有更好的方法
            <List sx={{display: "flex", flexDirection: "column", gap: 0.4}}>
                {Array.from({
                    length:
                        (
                            (nowModPage) * modPageSize < dependencies.current.length &&
                            (nowModPage + 1) * modPageSize >= dependencies.current.length
                        ) ?
                            (dependencies.current.length - nowModPage * modPageSize) :
                            modPageSize
                }).map((_item, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Skeleton style={{width: 48, height: 48}} variant="rounded"/>
                        </ListItemAvatar>
                        <ListItemText>
                            <Skeleton width="100%"><Typography fontSize={16} fontWeight="bold">.</Typography></Skeleton>
                            <Skeleton width="100%"><Typography fontSize={14}>.</Typography></Skeleton>
                        </ListItemText>
                    </ListItem>
                ))}</List> :
            <List>
                {modInfo.map((item, index) => (
                    <ListItemButton key={index}>
                        <ListItemAvatar>
                            <Avatar src={item.icon_url} style={{width: 48, height: 48}} sx={{bgcolor: iconBgColor}}
                                    variant="rounded"/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.name ? item.name : item.file_name}
                            primaryTypographyProps={{fontSize: 16, fontWeight: "bold"}}
                            secondary={item.version_number ? item.version_number : `${dict.server.modList[0]}`}
                            secondaryTypographyProps={{fontSize: 14}}
                        />
                    </ListItemButton>
                ))}
            </List>}
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <IconButton
                disabled={loadingMods || nowModPage === 0}
                onClick={() => {
                    setNowModPage((prev) => prev - 1)
                    loadPageOfMods(nowModPage - 1) // 因为这个时候 nowModPage 还是 prev！！
                }}
            >
                <KeyboardArrowLeft/>
            </IconButton>

            <Box sx={{display: "flex", alignItems: "center"}}>
                <Typography>{dependencies.current.length === 0 ? 0 : nowModPage + 1} / {Math.ceil(dependencies.current.length / modPageSize)}</Typography>
            </Box>

            <IconButton
                disabled={loadingMods || (nowModPage + 1) * modPageSize >= dependencies.current.length}
                onClick={() => {
                    setNowModPage((prev) => prev + 1)
                    loadPageOfMods(nowModPage + 1) // 因为这个时候 nowModPage 还是 prev！！
                }}
            >
                <KeyboardArrowRight/>
            </IconButton>
        </Box>
    </Box>)
}