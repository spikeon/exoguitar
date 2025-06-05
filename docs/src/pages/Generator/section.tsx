import { Typography } from "@mui/material"
import { Section } from "../../types/Parts"

interface GeneratorSectionProps {
    section: Section
}

const GeneratorSection = ({section}: GeneratorSectionProps) => (
    <>
        <Typography variant="h6">
            {section.name}
        </Typography>
    </>
)

export default GeneratorSection