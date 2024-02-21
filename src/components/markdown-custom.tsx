import Markdown from "markdown-to-jsx";
import {Link} from "@mui/material";

export default function MarkdownCustom({children}: {children: string}) {
    return <Markdown options={{
        disableParsingRawHTML: true,
        overrides: {
            a: {
                component: Link,
                props: {
                    target: "_blank"
                }
            }
        }
    }}>{children}</Markdown>
}