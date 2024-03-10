import {AccessApplyPayload} from "@/types";
import {dict} from "@/i18n/zh-cn";
import {Fragment} from "react";
import {toDisplayText} from "@/components/form-designer";
import {darken, Paper, Typography, useTheme} from "@mui/material";
import MarkdownCustom from "@/components/markdown-custom";

const {basic, remote, applying} = dict.access

export default function AccessPayloadReviewer(payload: AccessApplyPayload) {
    const {palette} = useTheme()

    return <Paper
        elevation={0}
        sx={{
            backgroundColor: darken(palette.background.default, 0.04),
            padding: 2
        }}
    >
        <Typography sx={{
            fontFamily: '"JetBrains Mono Variable", "Noto Sans SC Variable", monospace, sans-serif'
        }}>
            <b>{basic.title}</b> <br/>
            <b>{basic.name.title}:</b> {payload.basic.name} <br/>
            <b>{basic.logoLink.title}:</b> {payload.basic.logoLink} <br/>
            <b>{basic.coverLink.title}:</b> {payload.basic.coverLink} <br/>
            <b>{basic.introduction.title}:</b> <br/>
            <Paper sx={{padding: 2}}>
                <MarkdownCustom>
                    {payload.basic.introduction}
                </MarkdownCustom>
            </Paper>
            <br/>
            <b>{remote.title}</b> <br/>
            {payload.remote.java && <>
                <b>Java:</b> <br/>
                <b>{remote.common.address.title}:</b> {payload.remote.java.address} <br/>
                <b>{remote.common.port.title}:</b> {payload.remote.java.port} <br/>
                <b>{remote.common.compatibleVersions.title}:</b> {payload.remote.java.compatibleVersions.join(", ")} <br/>
                <b>{remote.common.coreVersion}:</b> {payload.remote.java.coreVersion} <br/>
                <b>Auth:</b> {payload.remote.java.auth} <br/>
                {payload.remote.java.modpackVersionId && <>
                    <b>{remote.java.mod.versionId}:</b> {payload.remote.java.modpackVersionId} <br/>
                </>}
            </>}
            {payload.remote.bedrock && <>
                <b>Bedrock</b>: <br/>
                <b>{remote.common.address.title}:</b> {payload.remote.bedrock.address} <br/>
                <b>{remote.common.port.title}:</b> {payload.remote.bedrock.port} <br/>
                <b>{remote.common.compatibleVersions.title}:</b> {payload.remote.bedrock.compatibleVersions.join(", ")} <br/>
                <b>{remote.common.coreVersion}:</b> {payload.remote.bedrock.coreVersion} <br/>
            </>}
            <br/>

            <b>{applying.title}:</b> {payload.applying.policy} <br/>
            {payload.applying.form && <>
                <b>Form:</b> <br/>
                {payload.applying.form.title} <br/>
                {payload.applying.form.preface} <br/>
                {payload.applying.form.questions.map((question, index) => <Fragment key={index}>
                    <b>{index + 1}.</b> ({toDisplayText(question.branches.type)}) {question.content} <i>{question.hint}</i>
                    {question.branches.type === "choice" && <>
                        [{question.branches.hasBlank && applying.design.question.branches.choice.hasBlank}]
                        [{question.branches.allowMultipleChoices && applying.design.question.branches.choice.allowMultipleChoices}]
                        <br/>
                        {question.branches.choices.map((choice, index) => <>
                            (Choice {index + 1}) {choice} <br/>
                        </>)}
                    </>}
                    {question.branches.type === "open" && <>
                        [{question.branches.allowMultipleLines && applying.design.question.branches.open.allowMultipleLines}]
                    </>}
                    {(
                        question.branches.type === "number" ||
                        question.branches.type === "dateYearMonth" ||
                        question.branches.type === "dateFull"
                    ) && <br/>}
                </Fragment>)}
            </>}
        </Typography>
    </Paper>
}