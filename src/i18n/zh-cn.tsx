import {Link, Typography} from "@mui/material";

export const dict = {
    portal: {
        title: "门户页面",
    },
    login: {
        title: "登录",

        username: "QQ 号 / 用户名",
        password: "密码",
        submit: "登录",

        fail: {
            title: "登录失败",

            networkError: "请检查网络连接是否正常。",
            incorrectCredentials: "请检查 QQ 号 / 用户名和密码是否正确。"
        },
        success: "登录成功"
    },
    register: {
        linkFromLoginPage: "注册",

        title: "注册",

        qid: "QQ号",
        qidError: {
            invalidQid: "请输入有效QQ号",
            alreadyExists: "此QQ号已经被注册",
        },
        username: "用户名",
        usernameError: {
            invalidUsername: "必须以字母开头，3~16字符",
            alreadyExists: "该用户名已被注册",
        },
        password: "密码",
        passwordError: "密码为8~20位，包含字母和数字",
        invitationCode: "邀请码（可选）",
        submit: "注册",

        fail: {
            title: "注册失败",
            networkError: "请检查网络连接是否正常",
            invalidPayload: "注册信息有误，请重试",
            timeout: "注册超时"
        },

        verify: {
            title: "验证",
            illustrate: "请将验证码发送至：",
            passkey: "验证码：",
            hint: "页面会自动跳转",
            complete: "注册完成",
            autoJump: "将在5秒后自动跳转至登录页面"
        }
    },
    list: {
        title: "服务器列表",
    },
    manage: {
        title: "服务器管理"
    },
    access: {
        title: "申请接入",
    },
    settings: {
        title: "个人设置",

        profile: {
            title: "Profile 管理",
            secondary: "Minecraft 账户的绑定与解绑",

            doBind: "绑定",
            javaMicrosoft: {
                title: "Java 版正版 Profile",
                fallback: "你还没有绑定 Java 版正版 Profile！"
            },
            javaLittleSkin: {
                title: "Java 版 LittleSkin Profile",
                fallback: "你还没有绑定 Java 版 LittleSkin Profile！"
            },
            xbox: {
                title: "基岩版 Profile",
                fallback: "你还没有绑定基岩版 Profile！"
            },
            offline: {
                title: "离线 Profile",
                fallback: "要增删和管理离线 Profile，请进入对应的服务器页面。",
                secondary: (serverId: number) => `服务器 ID #${serverId}`
            },

            onDelete: {
                content: "解绑此 Profile？",
                confirm: "确认",
                cancel: "取消"
            },

            bind: {
                submit: "开始绑定",
                javaMicrosoft: {
                    title: "Java 版正版（微软）Profile 绑定",
                    step1: {
                        title: "Step 1 - 设备码认证",
                        hint: "请打开链接并完成后续操作。点击时会打开一个新标签页，请在完成操作后回到原先的标签页。"
                    },
                    complete: "...没有 Step 2！已经完成啦！",
                    fail: {
                        internalError: "服务器出现了内部错误。请检查你的微软账号是否拥有 Minecraft。",
                        timeout: "操作超时。",
                        alreadyExists: "该 Profile 已经被其他人（也可能是你自己！）绑定。"
                    }
                },
                xbox: {
                    title: "基岩版（Xbox）Profile 绑定",
                    complete: "绑定完成！",
                    fail: {
                        internalError: "服务器出现了内部错误。请检查你的微软账号年龄是否超过 18 岁，以及你的家庭组设置。",
                        alreadyExists: "该 Profile 已经被其他人（也可能是你自己！）绑定。"
                    }
                },
                goBack: "返回 Profile 管理页面"
            }
        }
    },
    tools: {
        title: "实用工具",

        pcl2Subscription: {
            title: "PCL2 订阅"
        }
    }
}