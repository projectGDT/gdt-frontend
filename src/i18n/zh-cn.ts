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

        qid: "QQ号",
        qidError: {
            invalidQid: "请输入有效QQ号",
            alreadyExists: "此QQ号已经被注册",
        },
        username: "用户名",
        usernameError: ["用户名必须以字母开头，长度为3~16字符", "该用户名已被注册"],
        password: "密码",
        passwordError: ["密码至少为8位，包含字母和数字"],
        // confirmPassword: "确认密码",
        // confirmPasswordRequirement: ["两次输入密码不一致"],
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
    },
    tools: {
        title: "实用工具",

        pcl2Subscription: {
            title: "PCL2 订阅"
        }
    }
}