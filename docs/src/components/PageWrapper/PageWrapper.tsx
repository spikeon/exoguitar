import { Container, Divider, Typography } from "@mui/material"
import { ReactNode } from "react"

type PageWrapperProps = {
    title: String
    children: ReactNode
}

const PageWrapper = ({title, children}:PageWrapperProps) => {
    return (<>
        <Typography variant="h4" sx={{mb:2}}>
            {title}
        </Typography>
        <Divider />
        <Container sx={{
            pt: 3,
            pb: 2
        }}>
            {children}
        </Container>
    </>)
}

export default PageWrapper