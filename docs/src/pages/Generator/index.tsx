import PageWrapper from "../../components/PageWrapper/PageWrapper"
import { MaterialsProvider } from "../../contexts/materials/provider"

const Generator = () => {

    return (
        <MaterialsProvider>
            <PageWrapper title="Generator">
                <>Coming Soon</>
            </PageWrapper>
        </MaterialsProvider>
    )
}

export default Generator