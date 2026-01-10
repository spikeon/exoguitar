import { Route, Routes } from "react-router";
import Gallery from "./pages/Gallery";
import GeneratorPage from "./pages/Generator";
import UnifiedBom from "./pages/UnifiedBom";

const Router = () => (
    <Routes>
        <Route index element={<GeneratorPage />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="bom" element={<UnifiedBom />} />
    </Routes>
);

export default Router;