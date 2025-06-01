import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Gallery from "./pages/Gallery";

const Router = () => (
    <Routes>
        <Route index element={<Home />} />
        <Route path="generator" element={<Generator />} />
        <Route path="gallery" element={<Gallery />} />
    </Routes>
);

export default Router;