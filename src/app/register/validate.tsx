import { backendAddress, GET, POST } from "@/utils"
import { dict } from "@/i18n/zh-cn";

// 检查QQ号是否合法/是否已注册
export const validateQid = (qid: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // 前端检查是否是合法QQ号
        const regex = /^[0-9]{4,12}$/;
        if (!regex.test(qid)) {
            throw new Error(dict.register.qidError.invalidQid);
        }
        // 后端检查QQ号是否有效/是否被注册过
        fetch(`${backendAddress}/register/check-qid/${qid}`, GET(false))
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(dict.register.qidError.invalidQid);
            })
            .then((json: any) => {
                if (json["exists"]) {
                    throw new Error(dict.register.qidError.alreadyExists);
                }
                resolve();
            })
            .catch(e => reject(e)); // 所有错误交给InputBox处理
    });
}

// 检查用户名是否合法/是否已注册
export const validateUsername = (username: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        // 前端检查是否是合法用户名
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
        if (!regex.test(username)) {
            throw new Error(dict.register.usernameError.invalidUsername);
        }
        // 后端检查用户名是否有效/是否被注册过
        fetch(`${backendAddress}/register/check-username/${username}`, GET(false))
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(dict.register.usernameError.invalidUsername);
            })
            .then((json: any) => {
                if (json["exists"]) {
                    throw new Error(dict.register.usernameError.alreadyExists);
                }
                resolve();
            })
            .catch(e => reject(e)); // 所有错误交给InputBox处理
    });
}

// 检查密码是否合法
export const validatePassword = (password: string): Promise<void> => {
    return new Promise((resolve) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
        if (!regex.test(password)) {
            throw new Error(dict.register.passwordError);
        }
        resolve();
    });
}