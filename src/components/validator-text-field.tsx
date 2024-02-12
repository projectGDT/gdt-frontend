import React, {useRef, useState} from "react";
import {TextField, TextFieldProps, TextFieldPropsColorOverrides} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";

export type ValidationResult = {
    isValid: true
} | {
    isValid: false,
    hint: string
}

export default function ValidatorTextField({validator, setValid, onVerifyPass, ...others}: TextFieldProps & {
    validator: (input: string) => ValidationResult | Promise<ValidationResult>,
    setValid: React.Dispatch<React.SetStateAction<boolean>>,
    onVerifyPass?: (input: string) => void
}) {
    const [lastInput, setLastInput] = useState("")
    const [error, setError] = useState(false)
    const [focused, setFocused] = useState(false)
    const [color, setColor] = useState<
        OverridableStringUnion<
            "primary" | "error" | "secondary" | "info" | "success" | "warning",
            TextFieldPropsColorOverrides
        >
    >("primary")
    const [helperText, setHelperText] = useState(<></>)

    return <TextField
        error={error}
        color={color}
        focused={focused}
        onBlur={async event => {
            const input = event.target.value
            console.log(input)
            if (lastInput === input) return
            const result = await validator(input)
            if (result.isValid) {
                setValid(true)
                setError(false)
                setColor("success")
                setFocused(true)
                setHelperText(<></>)

                onVerifyPass?.(input)
            } else {
                setValid(false)
                setError(true)
                setHelperText(<>{result.hint}</>)
            }
            setLastInput(input)
        }}
        helperText={helperText}
        {...others}
    />
}

export function inOrder(...criteria: {
    validator: (value: string) => boolean | Promise<boolean>,
    hint: string
}[]): (input: string) => Promise<ValidationResult> {
    return async (input): Promise<ValidationResult> => {
        for (const {validator, hint} of criteria) {
            const isValid = await validator(input)
            if (!isValid) return {isValid, hint}
        }
        return {isValid: true}
    }
}