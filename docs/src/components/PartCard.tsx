import { Part } from "../types/Parts"
import GeneratorCard from "./GeneratorCard"

import placeholderImage from "./images/placeholder.png"

type PartCardProps = {
    part: Part | undefined
    onClick: () => void
}
const PartCard = ({part, onClick}:PartCardProps) => {
    const imageSrc = part?.thumb
        ? `${process.env.PUBLIC_URL || ""}/${part.thumb.replace(/\\/g, "/")}`
        : placeholderImage;

    return (
        <GeneratorCard
            onClick={onClick}
            image={imageSrc}
            title={part?.name ?? ""} />        
    )
}

export default PartCard;