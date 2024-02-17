import FormDesigner from "@/components/form-designer";
import {useRef, useState} from "react";
import {Form} from "@/types";

export default function StepApplying() {
    const formMetaRef = useRef<Form>()
    const [formValid, setFormValid] = useState(false)

    return <FormDesigner
        onChange={formMeta => formMetaRef.current = formMeta}
        setValid={value => {}}
    />
}