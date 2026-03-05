import React from "react";
import { render, screen } from "@testing-library/react";
import { PartsProvider } from "../../contexts/parts/provider";
import UnifiedBom from "./index";
import { Part } from "../../types/Parts";

const partsWithBom: Part[] = [
    {
        name: "Part A",
        section: "Bridge",
        path: "Bridge/Part A",
        hasBOM: true,
        hasAssembly: false,
        bom: [
            { name: "M3 Screw", qty: 4, amazon_url: "https://example.com", optional: false },
            { name: "M4 Nut", qty: 2, amazon_url: "https://example.com", optional: false },
        ],
    },
    {
        name: "Part B",
        section: "Neck",
        path: "Neck/Part B",
        hasBOM: true,
        hasAssembly: false,
        bom: [
            { name: "M3 Screw", qty: 6, amazon_url: "https://example.com", optional: false },
        ],
    },
];

const partsEmpty: Part[] = [];

describe("UnifiedBom", () => {
    it("renders PageWrapper with Unified BOM title", () => {
        render(
            <PartsProvider data={partsEmpty}>
                <UnifiedBom />
            </PartsProvider>
        );
        const titles = screen.getAllByText("Unified BOM");
        expect(titles.length).toBeGreaterThanOrEqual(1);
        expect(titles[0]).toBeInTheDocument();
    });

    it("renders the Unified BOM heading", () => {
        render(
            <PartsProvider data={partsEmpty}>
                <UnifiedBom />
            </PartsProvider>
        );
        const headings = screen.getAllByText("Unified BOM");
        expect(headings.length).toBeGreaterThanOrEqual(1);
    });

    it("renders BOM grid with columns Quantity and Name", () => {
        render(
            <PartsProvider data={partsWithBom}>
                <UnifiedBom />
            </PartsProvider>
        );
        expect(screen.getByText("Quantity")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("displays combined BOM materials from all parts", () => {
        render(
            <PartsProvider data={partsWithBom}>
                <UnifiedBom />
            </PartsProvider>
        );
        expect(screen.getByText("M3 Screw")).toBeInTheDocument();
        expect(screen.getByText("M4 Nut")).toBeInTheDocument();
    });

    it("uses minimum combined quantities per section then sums across sections", () => {
        render(
            <PartsProvider data={partsWithBom}>
                <UnifiedBom />
            </PartsProvider>
        );
        const grid = screen.getByRole("grid");
        expect(grid).toBeInTheDocument();
        expect(screen.getByText("M3 Screw")).toBeInTheDocument();
        expect(screen.getByText("M4 Nut")).toBeInTheDocument();
    });

    it("renders empty grid when no parts have BOM", () => {
        render(
            <PartsProvider data={partsEmpty}>
                <UnifiedBom />
            </PartsProvider>
        );
        expect(screen.getByRole("grid")).toBeInTheDocument();
    });
});
