"use client"
// 这一行很重要, 它表示以下所有的代码在客户端运行
// 低成本小水管服务器承受不了所有控件在服务端渲染, 所以必须指定这一行

import {dict} from "@/i18n/zh-cn";
// 语言文件, 后面做 i18n 的时候可能会对这里做修改
// 任何需要在用户界面显示的文本都存放在单独文件, 不要出现常量字符串

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from "react"
import { useRouter } from 'next/navigation'
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
    HomeOutlined, LinkOutlined, ManageAccountsOutlined, SvgIconComponent
} from "@mui/icons-material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {useSessionStorage} from "usehooks-ts";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Script from "next/script";

// 指定一些主题颜色
const gdtTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2a9849',
        },
        secondary: {
            main: '#da0357',
        },
    },
})

// 左侧侧边栏的宽度
const drawerWidth = 240

// 侧边栏导航按钮的基本信息, 通过 map 方法转换成按钮
const NAVIGATORS = [
    {
        href: "/",
        icon: HomeOutlined,
        display: dict.portal.title
    },
    {
        href: "/list",
        icon: DashboardCustomizeOutlined,
        display: dict.list.title
    },
    {
        href: "/manage",
        icon: DnsOutlined,
        display: dict.manage.title
    },
    {
        href: "/access",
        icon: LinkOutlined,
        display: dict.access.title
    },
    {
        href: "/settings",
        icon: ManageAccountsOutlined,
        display: dict.settings.title
    },
    {
        href: "/tools",
        icon: HandymanOutlined,
        display: dict.tools.title
    }
]

// AppBar 右上角账户组件，未登录显示登录/注册，登录显示头像
function Account(props: {id: Number, router: AppRouterInstance}) {
    if (props.id === -1) {
        // if not logged in
        return (
            <Button size={"large"} variant={"text"} color={"inherit"} onClick={() => props.router.push("/login")}>
                {dict.login.title + ' / ' + dict.register.title}
            </Button>
        )
    }
    // if logged in
    // TODO
    return (
        <IconButton size="large" aria-controls="menu-appbar" aria-haspopup={true} color="inherit">
            <AccountCircleOutlined />
        </IconButton>
    )
}

// RootLayout, 所有 UI 的根本框架 (布局), 具体的用户界面在 children 参数中传递, 嵌套在根本框架中
export default function RootLayout({children}: { children: React.ReactNode }) {
    // 显式指定跳转路径
    const router = useRouter()

    // sessionStorage, 浏览器原生特性, 能储存一些全局变量
    // 这里的三个值会在登录期间被赋值
    // usehooks-ts 提供的特性, 能在 Next 中安全地使用 sessionStorage (否则编译会报错, 虽然不影响正常使用)
    const [id, setId] = useSessionStorage("id", -1)
    const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [jwt, setJWT] = useSessionStorage("jwt", "")

    return (
        <html lang="zh">
        <head><title>projectGDT</title></head>
        <body>
        {/* 这种 Provider 是很常见的, 可以把一些参数 / 属性往下层层传递 */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={gdtTheme}><Box sx={{ display: 'flex' }}>
            {/* 用于屏蔽 Next.js 自带的样式表, 如果没有这一行, 上下左右会有默认的无法消除的 8px 页边距, 只在这一个地方写即可 */}
            <CssBaseline />

            {/* AppBar 形成了页面最上方的那一大团 */}
            <Box sx={{display: "flex"}}><AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Avatar src="/logo.svg" sx={{ width: 40, height: 40 }} variant={"square"}/>
                    <Typography variant={"h6"} sx={{paddingX: 1, flexGrow: 1}}>projectGDT</Typography>
                    <Account id={id} router={router} />
                </Toolbar>
            </AppBar></Box>

            {/* Drawer 形成了左侧侧边栏 */}
            <Drawer variant="permanent" sx={{
                width: drawerWidth,
                [`& .MuiDrawer-paper`]: { width: drawerWidth}}} // 很难堪地说, 这个属性我没整明白, 照抄的, 在别的地方应该没用
            >
                {/* 这里塞一个 Toolbar 是为了占位, 否则下面 List 的最上面的部分会被 AppBar 遮住 */}
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {/* "React 哲学", 用 map 把数组中的元素转换为 ListItem! */}
                        {NAVIGATORS.map(({href, icon: Icon, display}) =>
                            <ListItem key={href} disablePadding>
                                <ListItemButton onClick={() => router.push(href)}>
                                    <ListItemIcon><Icon/></ListItemIcon>
                                    <ListItemText primary={display}/>
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: 2.5 }}>
                {/* 同样是占位 */}
                <Box sx={{display: "flex"}}><Toolbar /></Box>
                {children}
            </Box>
        </Box>
        </ThemeProvider></AppRouterCacheProvider></body>
        </html>
    )
}
