// 检查QQ号是否合法/是否已注册
export const validateQQ = (qq: string): number => {
    // 检查是否是合法QQ号
    const regex = /^[0-9]{4,12}$/;
    if (!regex.test(qq)) {
        return 1;
    }
    // TODO: 检查QQ号是否被注册过
    return 0;
}

// 检查用户名是否合法/是否已注册
export const validateUsername = (username: string): number => {
    // 检查是否是合法用户名
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    if (!regex.test(username)) {
        return 1;
    }
    // TODO: 检查用户名是否被注册过
    return 0;
}

// 检查密码是否合法
export const validatePassword = (password: string): number => {
    return 0;
    // TODO: 检查密码
}