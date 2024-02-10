"use client"

import {dict} from "@/i18n/zh-cn";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, {useEffect, useState} from "react"
import {
    AppBar,
    Avatar,
    Box, Button,
    createTheme, CssBaseline,
    Drawer,
    IconButton,
    List, ListItem,
    ListItemButton, ListItemIcon,
    ListItemText,
    ThemeProvider, Toolbar,
    Typography
} from '@mui/material'
import {
    AccountCircleOutlined, DashboardCustomizeOutlined,
    DnsOutlined,
    HandymanOutlined,
    HomeOutlined, LinkOutlined, ManageAccountsOutlined
} from "@mui/icons-material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {useSessionStorage} from "usehooks-ts";

// 指定一些主题颜色
const gdtTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2a9849',
        },
        secondary: {
            main: '#ac01b1',
        },
        background: {
            default: '#f9f9f9',
        },
        text: {
            primary: 'rgba(0,0,0,0.75)',
        },
    },
})

// 左侧侧边栏的宽度
const drawerWidth = 240

// RootLayout, 所有 UI 的根本框架 (布局), 具体的用户界面在 children 参数中传递, 嵌套在根本框架中
export default function RootLayout({children}: { children: React.ReactNode }) {
    // sessionStorage, 浏览器原生特性, 能储存一些全局变量
    // 这里的三个值会在登录期间被赋值
    // usehooks-ts 提供的特性, 能在 Next 中安全地使用 sessionStorage (否则编译会报错, 虽然不影响正常使用)
    const [id, _setId] = useSessionStorage("id", -1)
    const [accountWidget, setAccountWidget] = useState(<></>)
    
    useEffect(() => {
        setAccountWidget(id === -1 ? <>
            <Button href={"/login"} size={"large"} variant={"text"} color={"inherit"}>{dict.login.title}</Button>
            <Button href={"/register"} size={"large"} variant={"text"} color={"inherit"}>{dict.register.title}</Button>
        </> : <IconButton size="large" aria-controls="menu-appbar" aria-haspopup={true} color="inherit">
            <AccountCircleOutlined />
        </IconButton>)
    }, [id])

    return <html lang="zh">
    <head><title>projectGDT</title></head>
    <body>
    {/* 这种 Provider 是很常见的, 可以把一些参数 / 属性往下层层传递 */}
    <AppRouterCacheProvider options={{ enableCssLayer: true }}><ThemeProvider theme={gdtTheme}>
        <CssBaseline/>

        {/* AppBar 形成了页面最上方的那一大团 */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Avatar src="/logo.svg" sx={{ width: 40, height: 40 }} variant={"square"}/>
                <Typography variant={"h6"} sx={{paddingX: 1, flexGrow: 1}}>projectGDT</Typography>
                {accountWidget}
            </Toolbar>
        </AppBar>
        <Box sx={{display: "flex", height: "100vh", backgroundColor: "background.default", flexDirection: "column", alignItems: "stretch"}}>
            <Toolbar/>
            {children}
        </Box>
    </ThemeProvider></AppRouterCacheProvider>
    </body>
    </html>
}
