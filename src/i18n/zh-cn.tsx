import {Link} from "@mui/material";

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

        qq: "QQ号",
        qqRequirement: ["", "请输入有效QQ号", "此QQ号已经被注册"],
        username: "用户名",
        usernameRequirement: ["", "用户名必须以字母开头，长度为3~16字符", "该用户名已被注册"],
        password: "密码",
        passwordRequirement: "密码至少为8位，包含字母和数字",
        confirmPassword: "确认密码",
        confirmPasswordRequirement: "两次输入密码不一致",
        inviteCode: "邀请码（可选）",
        submit: "注册",

        fail: {
            title: "注册失败",

            networkError: "请检查网络连接是否正常。",
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
            bind: {
                javaMicrosoft: {
                    title: "Java 版微软（正版）Profile 绑定",

                    submit: "开始绑定",

                    step1: {
                        title: "Step 1 - 设备码认证",
                        content: (link: string) => <>
                            请打开链接 <Link href={link} target={"_blank"}>{link}</Link> 并完成后续操作。 <br/>
                            此操作会打开一个新标签页。请在完成操作后回到原先的标签页。
                        </>
                    },

                    complete: {
                        title: "...没有 Step 2！已经完成啦！",
                        content: (uuid: string, playerName: string) => <>
                            你的 UUID 是 <b>{uuid}</b> <br/>
                            你的玩家名是 <b>{playerName}</b>
                        </>
                    },

                    fail: {
                        internalError: "服务器出现了内部错误。请检查你的微软账号是否拥有 Minecraft。",
                        timeout: "操作超时。",
                        alreadyExists: "该 Profile 已经被其他人（也可能是你自己！）绑定。"
                    }
                },
                xbox: {
                    title: "基岩版（Xbox）Profile 绑定",

                    submit: "开始绑定",

                    complete: {
                        title: "绑定完成",
                        content: (xuid: string, playerName: string) => <>
                            你的 XUID 是 <b>{xuid}</b> <br/>
                            你的玩家名是 <b>{playerName}</b>
                        </>
                    },

                    fail: {
                        internalError: "服务器出现了内部错误。请检查你的微软账号年龄是否超过 18 岁，以及你的家庭组设置。",
                        alreadyExists: "该 Profile 已经被其他人（也可能是你自己！）绑定。"
                    }
                }
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