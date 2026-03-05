import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PartsProvider } from "../../contexts/parts/provider";
import { GeneratorStateProvider } from "../../contexts/generatorState/provider";
import { MaterialsProvider } from "../../contexts/materials/provider";
import Generator from "./Generator";
import { Part } from "../../types/Parts";
import { Material } from "../../types/Materials";

const theme = createTheme({ palette: { mode: "dark" } });

function bom(name: string, qty: number, optional = false): Material {
    return { name, qty, amazon_url: "https://example.com", optional };
}

function part(
    name: string,
    section: string,
    bomItems: Material[],
    overrides: Partial<Part> = {}
): Part {
    return {
        name,
        section,
        path: `${section}/${name}`,
        hasBOM: true,
        hasAssembly: false,
        bom: bomItems,
        ...overrides,
    };
}

const acousticPart = part("Acoustic", "Face Plates", [bom("Acoustic Material", 1)]);
const electricFacePart = part("Electric Face", "Face Plates", [bom("Face Bolt", 2)]);
const testBridgePart = part("Test Bridge", "Bridge", [bom("Bridge Bearing", 1)]);
const testHeadPart = part("Test Head", "Head", [bom("Head Nut", 2)]);
const neckV3Part = part("Neck v3", "Neck", [bom("Neck v3 BOM Item", 3)]);
const wingSetPart = part("Wing Set One", "Wing Sets", [bom("Wing Screw", 6)]);

const generatorFixtureParts: Part[] = [
    acousticPart,
    electricFacePart,
    testBridgePart,
    testHeadPart,
    neckV3Part,
    wingSetPart,
];

function renderGenerator() {
    return render(
        <ThemeProvider theme={theme}>
            <PartsProvider data={generatorFixtureParts}>
                <MaterialsProvider>
                    <GeneratorStateProvider>
                        <Generator />
                    </GeneratorStateProvider>
                </MaterialsProvider>
            </PartsProvider>
        </ThemeProvider>
    );
}

describe("Generator", () => {
    describe("step flow paths", () => {
        it("Acoustic path: Guitar Type → Head → Wing Sets → Summary", async () => {
            renderGenerator();

            await userEvent.click(screen.getByText("Accoustic"));
            expect(screen.getByText(/Choose Head:/)).toBeInTheDocument();
            await userEvent.click(screen.getByText("Test Head"));
            expect(screen.getByText(/Choose Wing Sets:/)).toBeInTheDocument();
            await userEvent.click(screen.getByText("Wing Set One"));

            expect(screen.getByText(/Chosen\s+Parts/)).toBeInTheDocument();
            expect(screen.getByText("BOM")).toBeInTheDocument();
        });

        it("Electric path: Guitar Type → Face Plate → Bridge → Head → Wing Sets → Summary", async () => {
            renderGenerator();

            await userEvent.click(screen.getByText("Electric"));
            await userEvent.click(screen.getByText("Electric Face"));
            await userEvent.click(screen.getByText("Test Bridge"));
            expect(screen.getByText(/Choose Head:/)).toBeInTheDocument();
            await userEvent.click(screen.getByText("Test Head"));
            await userEvent.click(screen.getByText("Wing Set One"));

            expect(screen.getByText(/Chosen\s+Parts/)).toBeInTheDocument();
            expect(screen.getByText("BOM")).toBeInTheDocument();
        });
    });

    describe("BOM at summary", () => {
        it("Acoustic: BOM includes face plate, head, and Neck v3 materials", async () => {
            renderGenerator();

            await userEvent.click(screen.getByText("Accoustic"));
            await userEvent.click(screen.getByText("Test Head"));
            await userEvent.click(screen.getByText("Wing Set One"));

            expect(screen.getByText("Acoustic Material")).toBeInTheDocument();
            expect(screen.getByText("Head Nut")).toBeInTheDocument();
            expect(screen.getByText("Neck v3 BOM Item")).toBeInTheDocument();
            expect(screen.getByText("Wing Screw")).toBeInTheDocument();
        });

        it("Electric: BOM shows all selected part materials including Neck v3", async () => {
            renderGenerator();

            await userEvent.click(screen.getByText("Electric"));
            await userEvent.click(screen.getByText("Electric Face"));
            await userEvent.click(screen.getByText("Test Bridge"));
            await userEvent.click(screen.getByText("Test Head"));
            await userEvent.click(screen.getByText("Wing Set One"));

            expect(screen.getByText("Face Bolt")).toBeInTheDocument();
            expect(screen.getByText("Bridge Bearing")).toBeInTheDocument();
            expect(screen.getByText("Head Nut")).toBeInTheDocument();
            expect(screen.getByText("Neck v3 BOM Item")).toBeInTheDocument();
            expect(screen.getByText("Wing Screw")).toBeInTheDocument();

            const grid = screen.getByRole("grid");
            expect(within(grid).getByText("Face Bolt")).toBeInTheDocument();
            expect(within(grid).getByText("Bridge Bearing")).toBeInTheDocument();
            expect(within(grid).getByText("Head Nut")).toBeInTheDocument();
            expect(within(grid).getByText("Neck v3 BOM Item")).toBeInTheDocument();
            expect(within(grid).getByText("Wing Screw")).toBeInTheDocument();
            const gridCells = within(grid).getAllByRole("gridcell");
            const qtyCells = gridCells.filter((c) => c.getAttribute("data-field") === "qty");
            const quantities = qtyCells.map((c) => c.textContent);
            expect(quantities).toContain("2");
            expect(quantities).toContain("6");
        });

        it("BOM grid displays Quantity and Name columns", async () => {
            renderGenerator();
            await userEvent.click(screen.getByText("Accoustic"));
            await userEvent.click(screen.getByText("Test Head"));
            await userEvent.click(screen.getByText("Wing Set One"));

            expect(screen.getByText("Quantity")).toBeInTheDocument();
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });
    });
});
