"use client"

import React, {useEffect, useState} from "react";
import {Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import {
    DashboardCustomizeOutlined,
    DnsOutlined,
    HandymanOutlined,
    HomeOutlined,
    LinkOutlined, ManageAccountsOutlined
} from "@mui/icons-material";
import {dict} from "@/i18n/zh-cn";
import {useRouter} from "next/navigation";

// 侧边栏导航按钮的基本信息, 通过 map 方法转换成按钮
const navigation = [
    {
        href: "portal",
        icon: HomeOutlined,
        display: dict.portal.title
    },
    {
        href: "list",
        icon: DashboardCustomizeOutlined,
        display: dict.list.title
    },
    {
        href: "manage",
        icon: DnsOutlined,
        display: dict.manage.title
    },
    {
        href: "access",
        icon: LinkOutlined,
        display: dict.access.title
    },
    {
        href: "settings",
        icon: ManageAccountsOutlined,
        display: dict.settings.title
    },
    {
        href: "tools",
        icon: HandymanOutlined,
        display: dict.tools.title
    }
]

export default function PostLoginLayout({children}: { children: React.ReactNode }) {
    const router = useRouter()

    const [content, setContent] = useState(<></>)

    useEffect(() => {
        // 这里用 useSessionStorage 会出问题
        if (sessionStorage.getItem("jwt") !== '""') setContent(
        <Box sx={{display: "flex", flexGrow: 1}}>
            {/* Drawer 形成了左侧侧边栏 */}
            <Drawer variant="permanent" PaperProps={{
                sx: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    width: "15%",
                    flexGrow: 0
                }
            }} sx={{
                width: "15%"
            }}>
                {/* 这里塞一个 Toolbar 是为了占位, 否则下面 List 的最上面的部分会被 AppBar 遮住 */}
                <Toolbar/>
                <Box sx={{display: "flex", flexGrow: 1}}>
                    <List sx={{flexGrow: 1}}>
                        {/* "React 哲学", 用 map 把数组中的元素转换为 ListItem! */}
                        {navigation.map(({href, icon: Icon, display}) =>
                            <ListItem key={href} disablePadding>
                                <ListItemButton href={href}>
                                    <ListItemIcon><Icon/></ListItemIcon>
                                    <ListItemText primary={display}/>
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                    <Divider/>
                </Box>
            </Drawer>
            <Box sx={{
                display: "inline-flex",
                flexDirection: "column",
                flexGrow: 1,
                alignItems: "stretch",
                padding: 2
            }}>
                {children}
            </Box>
        </Box>
        )
        else router.push("/login")
    }, [children, router]);

    return content
}