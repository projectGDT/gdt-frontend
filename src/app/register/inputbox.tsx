import { useState } from "react";
import { TextField } from "@mui/material";

interface InputBoxProps {
    name: string;
    label: string;
    isPassword?: boolean;
    validator: (input: string) => number;
    helperTextList: string[];
}

// 定义了一个一般的输入框，使用时传入一个验证输入内容的函数validate，
// 返回0表示无错误，返回正整数将作为helperTextList下标设置提示内容
const InputBox: React.FC<InputBoxProps> = (props: InputBoxProps) => {
    const { name, label, isPassword = false, validator, helperTextList } = props;

    const [content, setContent] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    // 输入框失焦时进行一次验证
    function handleBlur(input: string): void {
        const result = validator(input);
        if (result === 0) {
            setError(false);
            setHelperText('');
        } else {
            setError(true);
            setHelperText(helperTextList[result]);
        }
    }

    return (
        <TextField
            name={name}
            label={label}
            type={isPassword ? "password" : undefined}
            variant="outlined"
            value={content}
            error={error}
            helperText={helperText}
            onBlur={() => handleBlur(content)}
            onChange={(e) => setContent(e.target.value)}
            sx={{width: "35vh"}}
        />
    )
}

export default InputBox;