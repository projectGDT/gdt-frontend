import { useState } from "react";
import { TextField } from "@mui/material";

const defaultValidator = (): Promise<void> => {
    return new Promise(resolve => resolve());
}

interface InputBoxProps {
    name: string;
    label: string;
    sx?: object;
    setValidity?: (status: boolean) => void; // 用于向父组件传递输入的正确性
    isPassword?: boolean;
    validator?: (input: string) => Promise<void>;
}

// 定义了一个一般的输入框，使用时传入一个 *异步* 验证输入内容的函数validate，
// resolve表示无错误，返回error message将设置为提示内容helperText
const InputBox: React.FC<InputBoxProps> = (props: InputBoxProps) => {
    const {
        name, label, sx = {width: "35vh"},
        setValidity = (b => {}), isPassword = false,
        validator = defaultValidator
    } = props;

    const [content, setContent] = useState('');
    const [lastContent, setLastContent] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    // 输入框内容变化时进行验证
    function handleBlur(input: string): void {
        // 与上次失焦时内容相同就不再验证
        if (input === lastContent) {
            return;
        }
        setLastContent(input);

        validator(input)
            .then(() => {
                setError(false);
                setHelperText('');
                setValidity(true);
            })
            .catch((e: Error) => {
                setError(true);
                setHelperText(e.message);
                setValidity(false);
            });
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
            sx={sx}
        />
    );
}

export default InputBox;