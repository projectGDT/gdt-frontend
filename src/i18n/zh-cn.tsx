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
        title: "注册",

        submit: {
            label: "提交",
            qid: {
                title: "QQ 号",
                error: {
                    invalid: "请输入有效QQ号",
                    alreadyExists: "此QQ号已经被注册",
                }
            },
            username: {
                title: "用户名",
                error: {
                    invalid: "必须以字母开头，3~16 字符",
                    alreadyExists: "该用户名已被注册",
                }
            },
            password: {
                title: "密码",
                error: {
                    invalid: "必须为 8~20 位，包含字母和数字"
                }
            },
            invitationCode: {
                title: "邀请码（可选）",
                error: {
                    invalid: "邀请码格式不正确"
                }
            },
            confirm: "确认",
            fail: {
                title: "注册失败",
                invalidPayload: "注册信息有误，请重试。",
                timeout: "操作超时。"
            }
        },
        verify: {
            label: "验证",
            content: (email: string, passkey: string) => <>
                请在 10 分钟内用 QQ 邮箱将验证码 <b>{passkey}</b> 发送至 <b>{email}</b>。
            </>,
            hint: (qid: string) => <>
                请将验证码写在邮件的<b>标题</b>中。<br/>
                请使用<b>数字 QQ 邮箱</b>（{qid}@qq.com）而非其他邮箱别名（[字母]@foxmail.com 等）。
            </>,
            waiting: "等待服务器回应……",
            go: "前往 QQ 邮箱"
        },
        complete: {
            title: "注册完成！",
            redirect: "5 秒后将跳转到服务器列表页面。"
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