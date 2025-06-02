import { Box, Divider, Typography } from "@mui/material"
import PageWrapper from "../../components/PageWrapper/PageWrapper"
import { usePartsContext } from "../../contexts/parts/context"

const Gallery = () => {
    const {parts} = usePartsContext()

    return (
        <PageWrapper title="Gallery">
            {parts.map((part) => (
                <>
                    <Typography variant="h5" sx={{mb:3}}>
                        {part.name}
                    </Typography>
                    <Box sx={{pl:4}}>
                        Coming Soon!
                    </Box>
                    <Divider sx={{mb: 5, mt: 5}} />
                </>
            ))}
        </PageWrapper>
    )
}

export default Gallery