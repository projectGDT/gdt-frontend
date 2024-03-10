"use client"

import React, {Fragment, ReactNode, useEffect, useState} from "react";
import {
    Box, Breadcrumbs, CircularProgress,
    Divider,
    Drawer, Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar, Typography
} from "@mui/material";
import {
    DashboardCustomizeOutlined,
    DnsOutlined,
    HandymanOutlined,
    HomeOutlined,
    LinkOutlined, ManageAccountsOutlined
} from "@mui/icons-material";
import {dict} from "@/i18n/zh-cn";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

type Navigation = {
    href: string,
    icon: typeof HomeOutlined
    display: string,
    additional: string[]
}

// 侧边栏导航按钮的基本信息, 通过 map 方法转换成按钮
const navigation: Navigation[] = [
    {
        href: "/post-login/portal",
        icon: HomeOutlined,
        display: dict.portal.title,
        additional: []
    },
    {
        href: "/post-login/list",
        icon: DashboardCustomizeOutlined,
        display: dict.list.title,
        additional: ["/post-login/server"]
    },
    {
        href: "/post-login/manage",
        icon: DnsOutlined,
        display: dict.manage.title,
        additional: []
    },
    {
        href: "/post-login/access",
        icon: LinkOutlined,
        display: dict.access.title,
        additional: []
    },
    {
        href: "/post-login/settings",
        icon: ManageAccountsOutlined,
        display: dict.settings.title,
        additional: []
    },
    {
        href: "/post-login/tools",
        icon: HandymanOutlined,
        display: dict.tools.title,
        additional: []
    }
]

const breadcrumbsMapping = (() => {
    const map = new Map<string, string>()

    map.set("access", dict.access.title)
        map.set("steps", dict.access.steps)
    map.set("list", dict.list.title)
    map.set("manage", dict.manage.title)
    map.set("server", dict.server.title)
    map.set("settings", dict.settings.title)
        map.set("profile", dict.settings.profile.title)
            map.set("java-microsoft", dict.settings.profile.javaMicrosoft.title)
            map.set("xbox", dict.settings.profile.xbox.title)

    return map
})()

function NavigationButton({href, icon: Icon, display, additional, pathName}: Navigation & {pathName: string}) {
    const selected = pathName.startsWith(href) || additional.includes(pathName)

    return <ListItemButton
        href={href} selected={selected}
        sx={{borderRadius: 1}}
    >
        <ListItemIcon>
            <Icon color={selected ? "primary" : "inherit"}/>
        </ListItemIcon>
        <ListItemText primary={display} primaryTypographyProps={{
            color: selected ? "primary" : "inherit",
        }}/>
    </ListItemButton>
}

export default function PostLoginLayout({children}: { children: React.ReactNode }) {
    const router = useRouter()
    const pathName = usePathname()
    const breadcrumbRaw = pathName.split("/")
    // 最开始的两项一定是 "" 和 "post-login"
    breadcrumbRaw.splice(0, 2)
    const searchParams = useSearchParams()

    const [content, setContent] = useState<ReactNode>(
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            alignSelf: "center"
        }}>
            <CircularProgress size={64} sx={{alignSelf: "center"}}/>
        </Box>
    )

    useEffect(() => {
        // 这里用 useSessionStorage 会出问题
        const jwt = sessionStorage.getItem("jwt")

        // 调试时候注释掉这一行即可去除前端鉴权
        if (!jwt || jwt === '""') router.push(`/login?postLogin=${pathName}?${searchParams.toString()}`); else

        setContent(children)
    }, [children, pathName, router, searchParams]);

    return <Box sx={{display: "flex", flexGrow: 1}}>
        {/* Drawer 形成了左侧侧边栏 */}
        <Drawer variant="permanent" PaperProps={{
            sx: {
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                width: "20%",
                flexGrow: 0
            }
        }} sx={{
            width: "20%"
        }}>
            {/* 这里塞一个 Toolbar 是为了占位, 否则下面 List 的最上面的部分会被 AppBar 遮住 */}
            <Toolbar/>
            <Box sx={{display: "flex", flexGrow: 1}}>
                <List sx={{flexGrow: 1}}>
                    {/* "React 哲学", 用 map 把数组中的元素转换为 ListItem! */}
                    {navigation.map(
                        (entry, index) => <Fragment key={index}>
                            <ListItem sx={{paddingY: 0.5, paddingX: 1}}>
                                <NavigationButton {...entry} pathName={pathName}/>
                            </ListItem>
                        </Fragment>
                    )}
                </List>
                <Divider/>
            </Box>
        </Drawer>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            alignItems: "stretch",
            padding: 2
        }}>
            <Breadcrumbs sx={{paddingBottom: 2}}>
                {breadcrumbRaw.map((entry, index) =>
                    (
                        index === breadcrumbRaw.length - 1 ?
                            <Typography
                                color={"primary"}
                                key={index}
                            >
                                {breadcrumbsMapping.get(entry) ?? entry}
                            </Typography> :
                            <Link
                                key={index}
                                color={"inherit"}
                                href={`/post-login/${breadcrumbRaw.slice(0, index + 1).join("/")}`}
                            >{breadcrumbsMapping.get(entry) ?? entry}</Link>
                    )
                )}
            </Breadcrumbs>
            {content}
        </Box>
    </Box>
}