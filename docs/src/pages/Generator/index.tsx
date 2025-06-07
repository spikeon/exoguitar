import PageWrapper from "../../components/PageWrapper/PageWrapper"
import { MaterialsProvider } from "../../contexts/materials/provider"
import { usePartsContext } from "../../contexts/parts/context"
import GeneratorSection from "./section";

const Generator = () => {
    const {sections} = usePartsContext();

    return (
        <MaterialsProvider>
            <PageWrapper title="Generator">
                {sections.map((section) => (
                    <GeneratorSection section={section} />
                ))}
            </PageWrapper>
        </MaterialsProvider>
    )
}

export default Generator