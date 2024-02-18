import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {ChoiceBranches, Form, OpenBranches, Question} from "@/types";
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Collapse,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    ListItemText,
    Radio,
    SvgIcon,
    Switch
} from "@mui/material";
import ValidatorTextField, {inOrder} from "@/components/validator-text-field";
import {dict} from "@/i18n/zh-cn";
import {
    AddOutlined,
    ArrowDownwardOutlined,
    ArrowUpwardOutlined,
    Delete,
    UnfoldLessOutlined,
    UnfoldMoreOutlined
} from "@mui/icons-material";
import {Updater, useImmer} from 'use-immer';
import {TransitionGroup} from "react-transition-group";
import {Draft} from "immer";

interface QuestionWrapper {
    key: number;
    question: Question;
    isValid: boolean;
    detailsExpanded: boolean;
}

const QuestionsDispatchContext = createContext<Updater<QuestionWrapper[]> | null>(null)
const QuestionIndexContext = createContext(-1)
const QuestionKeyContext = createContext(-1)

function newChoiceQuestion(): Question {
    return {
        content: "",
        required: true,
        branches: {
            type: "choice",
            choices: [],
            allowMultipleChoices: false,
            hasBlank: false
        }
    }
}

function newNumberQuestion(): Question {
    return {
        content: "",
        required: true,
        branches: {
            type: "number"
        }
    }
}

function newDateFullQuestion(): Question {
    return {
        content: "",
        required: true,
        branches: {
            type: "dateFull"
        }
    }
}

function newDateYearMonthQuestion(): Question {
    return {
        content: "",
        required: true,
        branches: {
            type: "dateYearMonth"
        }
    }
}

function newOpenQuestion(): Question {
    return {
        content: "",
        required: true,
        branches: {
            type: "open",
            allowMultipleLines: false
        }
    }
}

export default function FormDesigner({current, setValid}: {
    current: Form
    setValid: (isValid: boolean) => void
}) {
    const nextKey = useRef(0)
    const [formTitleValid, setFormTitleValid] = useState(false)
    const [prefaceValid, setPrefaceValid] = useState(true)
    const [questions, setQuestions] = useImmer<QuestionWrapper[]>([]);

    useEffect(() => {
        const isValid = formTitleValid &&
            prefaceValid &&
            questions.length > 0 &&
            allTrue(questions.map(wrapper => wrapper.isValid))
        setValid(isValid)
        if (isValid) current.questions = questions.map(wrapper => wrapper.question)
    }, [current, formTitleValid, prefaceValid, questions, setValid]);

    return <Box sx={{display: "flex", flexDirection: "column"}}>
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, marginBottom: 1}}>
            <ValidatorTextField
                label={dict.access.applying.design.formTitle.title}
                validator={inOrder({
                    validator: input => input.length >= 1 && input.length <= 30,
                    hint: dict.access.applying.design.formTitle.hint.invalidLength
                })}
                setValid={setFormTitleValid}
                onValidationPass={input => {
                    current.title = input
                }}
            />
            <ValidatorTextField
                multiline
                minRows={3}
                label={dict.access.applying.design.preface.title}
                validator={inOrder({
                    validator: input => input.length <= 300,
                    hint: dict.access.applying.design.preface.hint.invalidLength
                })}
                setValid={setPrefaceValid}
                onValidationPass={input => {
                    current.preface = input
                }}
            />
        </Box>
        <Divider/>
        <QuestionsDispatchContext.Provider value={setQuestions}>
            <TransitionGroup>
                {questions.map(({key, question, detailsExpanded}, index) => <Collapse key={key}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 0.5, marginY: 1}}>
                            <IconButton onClick={() => setQuestions(draft => {
                                draft[index].detailsExpanded = !draft[index].detailsExpanded
                            })}>
                                {detailsExpanded ? <UnfoldLessOutlined/> : <UnfoldMoreOutlined/>}
                            </IconButton>
                            <ListItemText
                                primary={<><b>{index + 1}. </b>{question.content}</>}
                                secondary={question.hint ?? ""}
                            />
                            <Chip label={toDisplayText(question.branches.type)}/>
                            <IconButton onClick={() => setQuestions(draft => {
                                draft[index].question.required = !draft[index].question.required
                            })}>
                                <SvgIcon color={question.required ? "error" : "inherit"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="M11 21v-6.6l-4.65 4.675l-1.425-1.425L9.6 13H3v-2h6.6L4.925 6.35L6.35 4.925L11 9.6V3h2v6.6l4.65-4.675l1.425 1.425L14.4 11H21v2h-6.6l4.675 4.65l-1.425 1.425L13 14.4V21z"/>
                                    </svg>
                                </SvgIcon>
                            </IconButton>
                            <IconButton
                                disabled={index === 0}
                                onClick={() => setQuestions(draft => {
                                    [draft[index], draft[index - 1]] = [draft[index - 1], draft[index]]
                                })}
                            ><ArrowUpwardOutlined/></IconButton>
                            <IconButton
                                disabled={index === questions.length - 1}
                                onClick={() => setQuestions(draft => {
                                    [draft[index], draft[index + 1]] = [draft[index + 1], draft[index]]
                                })}
                            ><ArrowDownwardOutlined/></IconButton>
                            <IconButton
                                onClick={() => setQuestions(draft => {
                                    draft.splice(index, 1)
                                })}
                            ><Delete/></IconButton>
                        </Box>
                        <Collapse in={detailsExpanded}>
                            <QuestionIndexContext.Provider value={index}>
                            <QuestionKeyContext.Provider value={key}>
                                <QuestionDesigner
                                    type={question.branches.type}
                                    setValid={isValid => setQuestions(draft => {
                                        draft[index].isValid = isValid
                                    })}
                                />
                            </QuestionKeyContext.Provider>
                            </QuestionIndexContext.Provider>
                        </Collapse>
                    </Box>
                    <Divider/>
                </Collapse>)}
            </TransitionGroup>
        </QuestionsDispatchContext.Provider>
        <Box sx={{display: "flex", justifyContent: "space-between", marginTop: 1}}>
            {[
                newChoiceQuestion,
                newNumberQuestion,
                newDateFullQuestion,
                newDateYearMonthQuestion,
                newOpenQuestion
            ].map((provider: () => Question, index: number) => {
                const newQuestion = provider()
                return <Button
                    key={index}
                    onClick={() => setQuestions(draft => {
                        draft.push({
                            key: nextKey.current++,
                            question: provider(),
                            isValid: false,
                            detailsExpanded: true
                        })
                    })}
                >{toDisplayText(newQuestion.branches.type)}</Button>
            })}
        </Box>
    </Box>
}

function QuestionDesigner({type, setValid}: {
    type: "number" | "choice" | "dateFull" | "dateYearMonth" | "open",
    setValid: (isValid: boolean) => void
}) {
    const setQuestions = useContext(QuestionsDispatchContext)!
    const index = useContext(QuestionIndexContext)
    const key = useContext(QuestionKeyContext)
    
    const [contentValid, setContentValid] = useState(false);
    const [hintValid, setHintValid] = useState(true);
    const [branchesValid, setBranchesValid] = useState(
        type !== "choice" // type 是 choice（选择题）的时候初始不合法，因为不能没有选项
    );

    useEffect(() => {
        setValid(contentValid && hintValid && branchesValid)
    }, [contentValid, hintValid, branchesValid, setValid]);

    return <Box sx={{display: "flex", flexDirection: "column", gap: 2, marginBottom: 1}}>
        <ValidatorTextField
            label={dict.access.applying.design.question.content.title}
            frequency={"onChange"}
            validator={inOrder({
                validator: input => input.length >= 1 && input.length <= 60,
                hint: dict.access.applying.design.question.content.hint.invalidLength
            })}
            setValid={value => {
                setContentValid(value)
            }}
            onValidationPass={input => setQuestions(draft => {
                draft[index].question.content = input
            })}
        />
        <ValidatorTextField
            label={dict.access.applying.design.question.hint.title}
            frequency={"onChange"}
            validator={inOrder({
                validator: input => input.length <= 300,
                hint: dict.access.applying.design.question.hint.hint.invalidLength
            })}
            setValid={value => {
                setHintValid(value)
            }}
            onValidationPass={input => setQuestions(draft => {
                draft[index].question.hint = input
            })}
        />
        {type === "choice" ? <ChoiceSubDesigner
            key={`question${key}.choiceDesigner`}
            setValid={value => {
                setBranchesValid(value)
            }}
        /> : <></>}
        {type === "open" ? <OpenSubDesigner
            key={`question${key}.openDesigner`}
        /> : <></>}
    </Box>
}

interface ChoiceWrapper {
    key: number;
    choice: string;
    isValid: boolean;
}

function ChoiceSubDesigner({setValid}: {
    setValid: (isValid: boolean) => void
}) {
    const setQuestions = useContext(QuestionsDispatchContext)!
    const index = useContext(QuestionIndexContext)

    const nextKey = useRef(0)

    const [choices, setChoices] = useImmer<ChoiceWrapper[]>([])
    const [allowMultipleChoices, setAllowMultipleChoices] = useState(false)

    useEffect(() => {
        setValid(choices.length > 0 && allTrue(choices.map(entry => entry.isValid)))
    }, [choices, setValid]);

    useEffect(() => {
        setQuestions(draft => {
            (draft[index].question.branches as Draft<ChoiceBranches>).choices = choices.map(entry => entry.choice)
        })
    }, [choices, index, setQuestions]);

    return <>
        <TransitionGroup>
            {choices.map(({key}, index) => <Collapse key={key}>
                <Box sx={{display: "flex", alignItems: "center", gap: 0.5, marginY: 1}}>
                    {allowMultipleChoices ?
                        <Checkbox checked={index === 0} disabled/> :
                        <Radio checked={index === 0} disabled/>}
                    <ValidatorTextField
                        size={"small"}
                        label={`${dict.access.applying.design.question.branches.choice.choice.title} ${index + 1}`}
                        validator={inOrder({
                            validator: input => input.length >= 1 && input.length <= 20,
                            hint: dict.access.applying.design.question.branches.choice.choice.hint.invalidLength
                        })}
                        setValid={value => {
                            setChoices(draft => {
                                draft[index].isValid = value
                            })
                        }}
                        onValidationPass={input => {
                            setChoices(draft => {
                                draft[index].choice = input
                            })
                        }}
                        sx={{flexGrow: 1}}
                    />
                    <IconButton
                        disabled={index === 0}
                        onClick={() => setChoices(draft => {
                            [draft[index], draft[index - 1]] = [draft[index - 1], draft[index]]
                        })}
                    ><ArrowUpwardOutlined/></IconButton>
                    <IconButton
                        disabled={index === choices.length - 1}
                        onClick={() => setChoices(draft => {
                            [draft[index], draft[index + 1]] = [draft[index + 1], draft[index]]
                        })}
                    ><ArrowDownwardOutlined/></IconButton>
                    <IconButton
                        onClick={() => setChoices(draft => {
                            draft.splice(index, 1)
                        })}
                    ><Delete/></IconButton>
                </Box>
            </Collapse>)}
        </TransitionGroup>
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "start"}}>
            <FormGroup row>
                <FormControlLabel
                    control={<Switch
                        onChange={(_event, checked) => {
                            setAllowMultipleChoices(true)
                            setQuestions(draft => {
                                (draft[index].question.branches as Draft<ChoiceBranches>).allowMultipleChoices = checked
                            })
                        }}
                    />}
                    label={dict.access.applying.design.question.branches.choice.allowMultipleChoices}
                />
                <FormControlLabel
                    control={<Switch onChange={(_event, checked) => {
                        setQuestions(draft => {
                            (draft[index].question.branches as Draft<ChoiceBranches>).hasBlank = checked
                        })
                    }}/>}
                    label={dict.access.applying.design.question.branches.choice.hasBlank}
                />
            </FormGroup>
            <IconButton
                onClick={() => setChoices(draft => {
                    draft.push({
                        key: nextKey.current++,
                        choice: "",
                        isValid: false
                    })
                })}
            ><AddOutlined/></IconButton>
        </Box>
    </>
}

function OpenSubDesigner() {
    const setQuestions = useContext(QuestionsDispatchContext)!
    const index = useContext(QuestionIndexContext)

    return <FormGroup row>
        <FormControlLabel
            control={<Switch onChange={(_event, checked) => {
                setQuestions(draft => {
                    (draft[index].question.branches as Draft<OpenBranches>).allowMultipleLines = checked
                })
            }}/>}
            label={dict.access.applying.design.question.branches.open.allowMultipleLines}
        />
    </FormGroup>
}

function allTrue(booleans: boolean[]) {
    for (const bool of booleans) {
        if (!bool) return false;
    }
    return true;
}

function toDisplayText(typeName: "choice" | "number" | "dateFull" | "dateYearMonth" | "open") {
    switch (typeName) {
        case "choice": return dict.access.applying.design.question.branches.choice.name;
        case "number": return dict.access.applying.design.question.branches.number.name;
        case "dateFull": return dict.access.applying.design.question.branches.dateFull.name;
        case "dateYearMonth": return dict.access.applying.design.question.branches.dateYearMonth.name;
        case "open": return dict.access.applying.design.question.branches.open.name;
    }
}