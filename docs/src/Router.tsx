import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import GeneratorPage from "./pages/Generator";

const Router = () => (
    <Routes>
        <Route index element={<Home />} />
        <Route path="generator" element={<GeneratorPage />} />
        <Route path="gallery" element={<Gallery />} />
    </Routes>
);

export default Router;