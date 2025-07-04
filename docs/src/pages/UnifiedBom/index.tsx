import { Typography } from "@mui/material";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import BomGrid from "../../components/BomGrid";
import { usePartsContext } from "../../contexts/parts/context";
import { generateMinimumCombinedBom } from "../../utils/BomUtils";
import { useMemo } from "react";

const UnifiedBom = () => {
    const {parts} = usePartsContext();

    const minimumCombinedBom = useMemo(() => generateMinimumCombinedBom(parts), [parts])

    return(
        <PageWrapper title="Unified BOM">
            <Typography variant="h2" align="left">
                Unified BOM
            </Typography>
            <BomGrid
                bom={minimumCombinedBom}
                />
        </PageWrapper>
    )
}

export default UnifiedBom;