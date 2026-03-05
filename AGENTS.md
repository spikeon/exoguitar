# ExoGuitar – Agent & contributor context

> **For AI agents:** Whenever you change project behavior, data formats, or key conventions, **update this file in the same PR** so future agents stay aligned with the current reality.

This file gives AI agents and contributors a shared picture of the project so we stay aligned on behavior and conventions.

## What ExoGuitar is

- **ExoGuitar** is a modular, mostly **3D-printed guitar system** built around aluminum extrusion (2020/2040). Interchangeable printed parts include: shoulders, necks, heads (or headless hardware), bridges, face plates, backs, **wing sets**, and straps.
- The **docs/** app is a **configurator**: users pick parts (neck, head, bridge, face plate, back, wing set, etc.) and get a **BOM for that chosen configuration** (not just a global BOM).

## Repo layout (high level)

| Area | Purpose |
|------|--------|
| **models/** | Source of truth for physical parts. Each part folder can have CAD (`.stl`, `.3mf`, `.step`), `BOM.txt`, `ASSEMBLY.md`, `meta.json`, and image folders (`photos`, `exploded views`, etc.). |
| **docs/** | React (Create React App) configurator that reads generated JSON and images from `docs/src/data/` and `docs/public/images/`. |
| **scripts/** | Node scripts: `generate_json_files.js` (main data generator), `check_missing_docs.js` (doc completeness), and `scripts/__tests__/` (Jest tests). |
| **Root** | `README.md` (partially generated), `ASSEMBLY.md`, `BOM.md`, `README.template.md`. |

## Wing sets – important behavior

- There is a **shared BOM** at `models/Wing Sets/BOM.txt`. It is the **starting point for every wing set**.
- Each wing-set **subfolder** (e.g. Arasaka, Plastic X, Heart) is treated as a **part**. The **parent folder** `Wing Sets` is **never** listed as a part.
- If a wing set has **its own** `BOM.txt`, those lines are **added** to the shared BOM for that part (merged), not used to replace the shared BOM.

So: shared BOM + optional per-wing BOM → one combined BOM per wing-set part.

## generate_json_files.js – behavior and conventions

- **Outputs**: `docs/src/data/` gets `sections.json`, `parts.json`, `unified_bom.json`, `bom.json`; images are copied into `docs/public/images/{section}/{part}/...`; root `README.md` is regenerated from `README.template.md` using generated MakerWorld links.
- **Sections skipped when scanning**: `Extras`, `Strap` (and hidden files / non-directories).
- **BOM format**: All `BOM.txt` files use columns `Qty`, `Name`, `Url`, `Optional` (tabs or 2+ spaces). For editor alignment, run `npm run format-bom-columns` to space-pad columns so they line up in a monospace view.
  - `Url` may be blank.
  - `Optional` is a `true`/`false` flag. Any `(Optional)` text in the name is stripped and moved into this column.
- **BOM parsing**: The parser splits on tabs / 2+ spaces and understands both old 3-column and new 4-column forms; `optional` defaults to `false` when the column is missing.
- **Canonicalization**: Item names are aggregated using a stable key (`makeItemKey`: normalize whitespace, collapse `M3 x 4 x 5` → `M3x4x5`, lowercase, strip trailing `s` for simple plurals). Per-part BOMs are later **backfilled** with the canonical display name and Amazon URL from the unified BOM so the configurator shows consistent names and links.
- **Testability**: The script uses a `createState()` pattern and accepts an optional `copyImagesFn` in the scan context so tests can avoid real file copies (Jest mocks `copyImages` in the two `scanDirectory` tests).

## Testing

- **Framework**: Jest. Config: `jest.config.cjs`; tests live under `scripts/__tests__/*.test.js`.
- **Run**: `npm test`
- **Convention**: Tests that call `scanDirectory` pass `copyImagesFn: jest.fn()` so no image files are actually copied or moved.

## Meta and JSON gotchas

- **meta.json** in part or section folders is read with `JSON.parse`. Invalid JSON (e.g. trailing commas) will break scanning for that directory and produce a warning (e.g. “Expected double-quoted property name…”). Keep all `meta.json` files valid.

## Commands

- `npm run generate-json-files` – regenerate all JSON, images copy, and README.
- `npm run format-bom-columns` – align BOM.txt columns with space padding for readability in the editor.
- `npm run check-missing-docs` – report parts missing BOM or ASSEMBLY docs.
- `npm test` – run Jest tests.

---

*This file summarizes project details and conventions discussed during development so agents and contributors can stay aligned.*
