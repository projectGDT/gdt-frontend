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
    logout: {
        title: "注销"
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
    },
    tools: {
        title: "实用工具",

        pcl2Subscription: {
            title: "PCL2 订阅"
        }
    }
}