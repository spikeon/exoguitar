import PageWrapper from "../../components/PageWrapper/PageWrapper"
import { GeneratorStateProvider } from "../../contexts/generatorState/provider";
import { MaterialsProvider } from "../../contexts/materials/provider"
import Generator from "./Generator";


const GeneratorPage = () => {
    
    return (
        <MaterialsProvider>
            <PageWrapper title="Generator">
                <GeneratorStateProvider>
                  <Generator />
                </GeneratorStateProvider>
            </PageWrapper>
        </MaterialsProvider>
    )
}

export default GeneratorPage