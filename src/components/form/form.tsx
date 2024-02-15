import {MutableRefObject, useRef} from "react";

export default function Form({questions, valueRef}: {
    questions: any[],
    valueRef: MutableRefObject<any[]>
}) {
    // questions.map((entry, index) =>
    // <(QuestionComponent)
    //  question=entry
    //  setValue={input => {ref[index] = input}}
    // />)
}