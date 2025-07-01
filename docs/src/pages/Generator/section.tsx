import { Typography } from "@mui/material"
import { Section } from "../../types/Parts"
import { useState } from "react";

interface GeneratorSectionProps {
    section: Section
}

const GeneratorSection = ({section}: GeneratorSectionProps) => {
    const [generatorState, setSelectedParts] = useState([]);

    

    return (
        <>
            <Typography variant="h6">
                {section.name}
            </Typography>
            <ul>
                {section.parts?.map((part) => (
                    <li>{part.name}</li>
                ))}
            </ul>
        </>
    )
}

export default GeneratorSection