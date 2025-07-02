import { Part } from "../types/Parts"
import GeneratorCard from "./GeneratorCard"

type PartCardProps = {
    part: Part | undefined
    onClick: () => void
}
const PartCard = ({part, onClick}:PartCardProps) => {

    return (
        <GeneratorCard
            onClick={onClick}
            image={part?.thumb}
            title={part?.name ?? ""} />        
    )
}

export default PartCard;