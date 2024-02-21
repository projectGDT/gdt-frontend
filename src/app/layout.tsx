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
    Avatar,
    Box, Button,
    createTheme, CssBaseline,
    IconButton,
    Menu, MenuItem, ListItemIcon,
    ThemeProvider, Toolbar,
    Typography, GlobalStyles, darken, Drawer
} from '@mui/material'
import {AccountCircleOutlined, HelpOutline, Logout} from "@mui/icons-material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {useSessionStorage} from "usehooks-ts";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {usePathname, useRouter} from "next/navigation";
import MarkdownCustom from "@/components/markdown-custom";

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
function AccountMenu(props: {router: AppRouterInstance}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    // 注销
    const handleLogoutClick = () => {
        // 清空jwt，返回登录页面
        window.sessionStorage.setItem('jwt', '');
        setAnchorEl(null);
        props.router.push("/login");
        window.location.reload();
    };

    return (
        <div>
            <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup={true}
                color="inherit"
                onClick={handleClick}
            ><AccountCircleOutlined /></IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    {dict.logout.title}
                </MenuItem>
            </Menu>
        </div>
    )
}

function AccountWidget(jwt: string, router: AppRouterInstance) {
    // 未登录
    if (!jwt) {
        return (
            <Button size={"large"} variant={"text"} color={"inherit"} onClick={() => router.push("/login")}>
                {dict.login.title}
            </Button>
        );
    }
    // 已登录
    return <AccountMenu router={router}></AccountMenu>
}

// RootLayout, 所有 UI 的根本框架 (布局), 具体的用户界面在 children 参数中传递, 嵌套在根本框架中
export default function RootLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();

    // sessionStorage, 浏览器原生特性, 能储存一些全局变量
    // usehooks-ts 提供的特性, 能在 Next 中安全地使用 sessionStorage (否则编译会报错, 虽然不影响正常使用)
    const [jwt, _setJWT] = useSessionStorage("jwt", "")
    const [accountWidget, setAccountWidget] = useState(<></>)

    const pathName = usePathname()
    const [showDocumentWidget, setShowDocumentWidget] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentMdText, setDocumentMdText] = useState("")

    useEffect(() => {setAccountWidget(AccountWidget(jwt, router));}, [jwt, router]);

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
    <AppRouterCacheProvider options={{ enableCssLayer: true }}><ThemeProvider theme={gdtTheme}>
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
                {accountWidget}
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
    </ThemeProvider></AppRouterCacheProvider>
    </body>
    </html>
}
