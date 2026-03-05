# Markdown (.md) audit summary

**Audit date:** 2025-03-05  
**Scope:** Grammar, readability, internal links, and obvious typos across repo `.md` files.

---

## Fixes applied

### Grammar and typos
- **README.md / README.template.md:** "indended" → "intended"
- **ASSEMBLY.md:** "welcone" → "welcome"; "it's" → "its" (possessive, 2 places); "accoustic" → "acoustic" (3 places); "resonation" → "resonance"; "gentile" → "gentle"; "goint" → "going"; "Paralell" → "Parallel"; "alllll" → "all"; "thren" → "then"; "maintence" → "maintenance"
- **CONTRIBUTING.md:** "copy the it" → "copy it"; "Paralell" → "Parallel"; template file description "create your own bridge" → "create your own head" (for the Head blank template)
- **BOM.md:** "it's own" → "its own"; missing dollar sign in table "8.49" → "$8.49"

### Internal links corrected
- **ASSEMBLY.md:** [Arrow](/models/Head/Head/ASSEMBLY.md) → `/models/Head/Arrow/ASSEMBLY.md` (folder is Arrow, not Head)
- **ASSEMBLY.md:** [Headless](/models/Head/Headless%20Adjustable%20Nut/ASSEMBLY.md) → `/models/Head/Headless/ASSEMBLY.md` (folder is Headless)

---

## Remaining / known issues

### Internal links that may be dead or need verification
- **ASSEMBLY.md – Neck (section 2):** Links to `/models/Neck/Metal Frets/`, `Filament Frets`, `Fretless`, `Printed Frets` – the repo currently has `models/Neck/Neck v3/` and `models/Neck/Tools/Sanding Jig/` only. Consider updating the Neck section to match current folder layout or add redirects.
- **ASSEMBLY.md – Shoulders:** Links use `Offset%20-%20Regular%20Neck` and `Parallel%20-%20Regular%20Neck`. Confirm folder names match (e.g. "Offset - Regular Neck" vs "Parallel - Regular Neck").
- **BOM.md:** Fret Wire Bender points to `./models/Neck/tools/Fret%20Bender/ASSEMBLY.md`. If the path is `models/Neck/Tools/` (capital T) or the Fret Bender folder is missing, this link will 404.

### External links
- **Not checked.** All MakerWorld, Amazon (amzn.to), OnShape, Etsy, and other external URLs were left as-is. Consider running a link checker (e.g. markdown-link-check) periodically for dead external links.

### Readability / style (optional)
- **README.md:** "Makerworld" vs "MakerWorld" – heading says "Makerworld Links"; elsewhere "MakerWorld" is used. Unify if desired.
- **ASSEMBLY.md:** Some sentences are long; splitting or bullet points could improve scanability.

### Other files
- **docs/README.md:** Standard Create React App text; no changes.
- **MISSING_DOCS_CHECKLIST.md:** Generated; typo "Symmertrical" in README (Wing Sets) is in generated content – fix in script or template if regenerated.
- **Model-level ASSEMBLY.md** (e.g. under `models/Head/`, `models/Bridge/`): Only root and key docs were audited; per-model docs were not reviewed line-by-line.

---

## Recommendation
- Re-run this audit after major repo structure changes (e.g. renaming `Neck` subfolders or adding Fret Bender).
- Add a pre-commit or CI step for markdown link checking if you want to catch broken links automatically.
