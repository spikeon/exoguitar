import { Part } from "../types/Parts"
import GeneratorCard from "./GeneratorCard"

import placeholderImage from "./images/placeholder.png"

type PartCardProps = {
    part: Part | undefined
    onClick: () => void
}
const PartCard = ({part, onClick}:PartCardProps) => {

    return (
        <GeneratorCard
            onClick={onClick}
            image={part?.thumb || placeholderImage}
            title={part?.name ?? ""} />        
    )
}

export default PartCard;