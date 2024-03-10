"use client"

import {dict} from "@/i18n/zh-cn";

import '@fontsource-variable/noto-sans-sc';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

import React, {useEffect, useState} from "react"
import {
    AppBar,
    Avatar, Badge,
    Box,
    Button,
    createTheme,
    CssBaseline,
    darken,
    Drawer,
    GlobalStyles,
    IconButton,
    ListItemIcon, ListItemText,
    Menu,
    MenuItem, NoSsr,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material'
import {AccountCircleOutlined, HelpOutline, Logout, MailOutline} from "@mui/icons-material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {useSessionStorage} from "usehooks-ts";
import {usePathname, useRouter} from "next/navigation";
import MarkdownCustom from "@/components/markdown-custom";
import {ConfirmProvider} from "material-ui-confirm";
import {backendAddress, GET} from "@/utils";

// 指定一些主题颜色
const gdtTheme = createTheme({
    typography: {
        fontFamily: [
            '"Inter"',
            '"Noto Sans SC Variable"',
            'sans-serif'
        ].join(','),
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#2a9849',
        },
        secondary: {
            light: '#ee9611',
            main: '#ac01b1',
        },
        background: {
            default: '#f9f9f9',
        },
        text: {
            primary: 'rgba(0,0,0,0.825)',
        },

    },
})

// 登录后账户头像处菜单
function AccountMenu() {
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pathName = usePathname()
    const open = Boolean(anchorEl);

    const [jwt, setJWT] = useSessionStorage("jwt", "")

    const [unreadCount, setUnreadCount] = useState(0)

    return !jwt ? <Button size={"large"} variant={"text"} color={"inherit"} href={"login"}>
        {dict.login.title}
    </Button> : <div>
        <IconButton
            size="large"
            aria-controls="menu-appbar"
            aria-haspopup={true}
            color="inherit"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorEl(event.currentTarget);
            }}
        >
            <Badge badgeContent={unreadCount} color={"secondary"} overlap={"circular"}>
                <AccountCircleOutlined/>
            </Badge>
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={() => {
                setAnchorEl(null);
            }}
            onClick={() => {
                setAnchorEl(null);
            }}
        >
            <MenuItem onClick={() => {
                router.push("/message")
            }}>
                <ListItemIcon>
                    <MailOutline fontSize={"small"}/>
                </ListItemIcon>
                <ListItemText>
                    {dict.messages.unread} ({unreadCount})
                </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                // 清空jwt，返回登录页面
                setJWT("");
                router.push(`/login?postLogin=${pathName}`);
            }}>
                <ListItemIcon>
                    <Logout fontSize="small"/>
                </ListItemIcon>
                {dict.logout.title}
            </MenuItem>
        </Menu>
    </div>
}

// RootLayout, 所有 UI 的根本框架 (布局), 具体的用户界面在 children 参数中传递, 嵌套在根本框架中
export default function RootLayout({children}: { children: React.ReactNode }) {
    const pathName = usePathname()
    const [showDocumentWidget, setShowDocumentWidget] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentMdText, setDocumentMdText] = useState("")

    useEffect(() => {
        fetch(`/docs${pathName}.md`)
            .then(res => {
                if (res.status === 404) return Promise.reject("not-found")
                return res.text()
            })
            .then(text => {
                setDocumentMdText(text)
                setShowDocumentWidget(true)
            })
            .catch(_err => setShowDocumentWidget(false))
    }, [pathName]);

    return <html lang="zh">
    <head><title>projectGDT</title></head>
    <body>
    {/* 这种 Provider 是很常见的, 可以把一些参数 / 属性往下层层传递 */}
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ThemeProvider theme={gdtTheme}>
    <ConfirmProvider defaultOptions={{
        title: dict.common.confirm,
        confirmationText: dict.common.ok,
        cancellationText: dict.common.cancel
    }}>
        <CssBaseline/>
        <GlobalStyles styles={{
            code: {
                fontFamily: '"JetBrains Mono Variable", "Noto Sans SC Variable", monospace, sans-serif',
                backgroundColor: darken(gdtTheme.palette.background.default, 0.07),
                borderRadius: '0.25rem',
                padding: '0.25rem 0.5rem',
                margin: '0 0.25rem'
            },
            pre: {
                backgroundColor: darken(gdtTheme.palette.background.default, 0.07),
                borderRadius: '0.25rem',
                padding: '0.25rem 0.5rem'
            },
            "pre > code": {
                borderRadius: '0',
                padding: '0'
            },
            blockquote: {
                margin: 0,
                backgroundColor: darken(gdtTheme.palette.background.default, 0.07),
                padding: '0.25rem 0.5rem'
            }
        }}/>

        {/* AppBar 形成了页面最上方的那一大团 */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar disableGutters sx={{paddingX: 2}}>
                <Avatar src="/logo.svg" sx={{ width: 40, height: 40 }} variant={"square"}/>
                <Typography variant={"h6"} sx={{paddingX: 1, flexGrow: 1}}>projectGDT</Typography>
                {showDocumentWidget ? <IconButton color={"inherit"} onClick={() => setShowDocument(prev => !prev)}>
                    <HelpOutline/>
                </IconButton> : <></>}
                <NoSsr>
                    <AccountMenu/>
                </NoSsr>
            </Toolbar>
        </AppBar>

        <Drawer
            open={showDocument}
            anchor={"right"}
            onClose={() => setShowDocument(false)}
            sx={{ zIndex: (theme) => theme.zIndex.drawer }}
        >
            <Toolbar/>
            <Box padding={2} width={"40vw"}><MarkdownCustom>{documentMdText}</MarkdownCustom></Box>
        </Drawer>

        <Box sx={{display: "flex", height: "100vh", backgroundColor: "background.default", flexDirection: "column", alignItems: "stretch"}}>
            <Toolbar/>
            {children}
        </Box>
    </ConfirmProvider>
    </ThemeProvider>
    </AppRouterCacheProvider>
    </body>
    </html>
}
