export const dict = {
    portal: {
        title: "门户页面",
    },
    login: {
        title: "登录",

        username: {
            title: "QQ 号 / 用户名",
            error: {
                invalid: "该字段不能为空"
            }
        },
        password: {
            title: "密码",
            error: {
                invalid: "密码不能为空"
            }
        },
        submit: "登录",

        fail: {
            title: "登录失败",

            networkError: "请检查网络连接是否正常。",
            incorrectCredentials: "请检查 QQ 号 / 用户名和密码是否正确。"
        },
        success: "登录成功"
    },
    logout: {
        title: "注销"
    },
    register: {
        title: "注册",

        submit: {
            label: "提交",
            qid: {
                title: "QQ 号",
                error: {
                    invalid: "请输入有效 QQ 号",
                    alreadyExists: "此 QQ 号已经被注册",
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
        subtitle: ["我加入的", "发现"],
        cardButtons: ["设置", "管理"],
    },
    serverid: {
        headerButtons: ["登入", "设置", "申请", "加入"],
        cardTitle: ["状态", "Java 版", "基岩版", "玩家列表"],
        cardSubtitle: ["核心版本", "兼容版本"],
        modTitle: ["Mod 服", "Mod 列表"],
        support: ["支持", "不支持"],
        authName: ["服主", "管理员"],
        playerCount: (count: number) => `（${count}人）`,
        accessPrompt: ["请登录", "请申请加入服务器", "请加入服务器", "，以获取完整玩家列表"],
        modList: ["上传的文件"]
    },
    manage: {
        title: "服务器管理"
    },
    access: {
        title: "申请接入",
        license: <>
            <Typography variant={"h3"}><b>本网站立足于美利坚合众国</b></Typography>
            <Typography variant={"h4"}>
                未满18岁请勿打开本站 <br/>
                牢记本站永久域名：<b>localhost</b> <br/>
                备用域名：<b>127.0.0.1</b>
            </Typography>
        </>,
        confirm: "是的，我已满18岁",
        go: "开始申请",

        steps: {
            basic: {
                title: "基本信息",
                name: {
                    title: "服务器名称",
                    hint: {
                        invalidLength: "长度必须在 3~30 个字符之间。"
                    }
                },
                logoLink: {
                    title: "Logo 图片链接",
                    hint: {
                        fallback: "请将图片上传至外部图床。建议宽、高相等且大于 64px。",
                        invalid: "URL 格式不合法"
                    }
                },
                coverLink: {
                    title: "封面图片链接",
                    hint: {
                        fallback: "请将图片上传至外部图床。建议宽高比 16:9。",
                        invalid: "URL 格式不合法"
                    },
                    preview: {
                        title: "预览",
                        error: "图片加载出错。",
                        hint: "若图片宽高比不是 16:9，则在显示时会被裁去一部分。请在此确认渲染效果。"
                    }
                },
                introduction: {
                    title: "服务器介绍（Markdown 格式）",
                    hint: {
                        fallback: "建议在其他的 Markdown 编辑器中编辑后再复制到此处。",
                        invalidLength: "长度必须在 3000 个字符之内。"
                    }
                }
            },
            remote: {
                title: "远程信息",
                common: {
                    address: {
                        title: "服务器地址",
                        hint: {
                            fallback: "域名或 IP",
                            invalid: "服务器地址格式不正确"
                        }
                    },
                    port: {
                        title: "服务器端口",
                        hint: {
                            fallback: "0~65535 之间的整数",
                            invalid: "服务器端口格式不正确"
                        }
                    },
                    compatibleVersions: {
                        title: "兼容版本",
                        hint: {
                            atLeastOne: "请选择至少一个版本。"
                        }
                    },
                    coreVersion: "服务端核心版本"
                },
                java: {
                    supports: "支持 Java 版",
                    mod: {
                        hint: <>
                            如果你的服务器是 Mod 服，请在 <Link href={"https://modrinth.com/"}>Modrinth</Link> 上创建包含所需 Mod 和资源包的 Project，并填写以下内容。
                        </>,
                        project: {
                            title: "Project ID 或 Slug",
                            hint: {
                                invalid: "ID 或 Slug 不合法或不存在"
                            }
                        },
                        versionId: "版本 ID",
                        preview: {

                        }
                    }
                },
                bedrock: {
                    supports: "支持基岩版"
                }
            },
            applying: {
                title: "申请政策"
            },
            next: "下一步",
            previous: "上一步",
            complete: "完成"
        }
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