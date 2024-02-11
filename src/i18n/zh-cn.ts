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
        accessPrompt: ["请申请加入服务器", "请加入服务器"]
    },
    manage: {
        title: "服务器管理"
    },
    access: {
        title: "申请接入",
    },
    settings: {
        title: "个人设置",
    },
    tools: {
        title: "实用工具",

        pcl2Subscription: {
            title: "PCL2 订阅"
        }
    }
}