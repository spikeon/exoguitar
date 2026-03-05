const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  parseBOMFile,
  addToUnifiedBOM,
  scanDirectory,
  createState,
} = require('../generate_json_files');

describe('generate_json_files helpers', () => {
  test('parseBOMFile parses simple BOM lines with and without URLs', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exoguitar-bom-'));
    const bomPath = path.join(tmpDir, 'BOM.txt');
    const content = [
      'Qty  Name                Url',
      '2    M3x4x5 Heat Set Inserts    https://amzn.to/example',
      '5    M5 Slide In Nuts',
    ].join('\n');
    fs.writeFileSync(bomPath, content, 'utf8');

    const items = parseBOMFile(bomPath);
    expect(items).toEqual([
      {
        qty: 2,
        name: 'M3x4x5 Heat Set Inserts',
        amazon_url: 'https://amzn.to/example',
        optional: false,
      },
      {
        qty: 5,
        name: 'M5 Slide In Nuts',
        amazon_url: '',
        optional: false,
      },
    ]);
  });

  test('parseBOMFile supports punctuation-heavy names (previously missing)', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exoguitar-bom-'));
    const bomPath = path.join(tmpDir, 'BOM.txt');
    const content = [
      'Qty  Name                Url',
      '1    12V 1200mAh Rechargeable Li-ion Battery, 12 Volt DC5521    https://amzn.to/battery',
    ].join('\n');
    fs.writeFileSync(bomPath, content, 'utf8');

    const items = parseBOMFile(bomPath);
    expect(items).toEqual([
      {
        qty: 1,
        name: '12V 1200mAh Rechargeable Li-ion Battery, 12 Volt DC5521',
        amazon_url: 'https://amzn.to/battery',
        optional: false,
      },
    ]);
  });

  test('addToUnifiedBOM aggregates quantities and preserves URLs', () => {
    const state = createState();
    addToUnifiedBOM(
      { qty: 2, name: 'M3x4x5 Heat Set Inserts', amazon_url: 'https://amzn.to/example', optional: false },
      'Some/Part',
      state
    );
    addToUnifiedBOM(
      { qty: 3, name: 'M3x4x5 Heat Set Inserts', amazon_url: '', optional: false },
      'Some/Part',
      state
    );

    const items = Array.from(state.unifiedBOM.values());
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      name: 'M3x4x5 Heat Set Inserts',
      qty: 5,
      amazon_url: 'https://amzn.to/example',
    });

    expect(state.partsBOM['Some/Part']).toHaveLength(1);
    expect(state.partsBOM['Some/Part'][0]).toMatchObject({
      name: 'M3x4x5 Heat Set Inserts',
      qty: 5,
    });
  });

  test('scanDirectory discovers parts and attaches BOM items (without moving files)', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'exoguitar-models-'));
    const modelsPath = path.join(root, 'models');
    const imagesOutputPath = path.join(root, 'images-out');
    fs.mkdirSync(modelsPath);

    // Create a simple section and part
    const sectionDir = path.join(modelsPath, 'TestSection');
    const partDir = path.join(sectionDir, 'TestPart');
    fs.mkdirSync(sectionDir);
    fs.mkdirSync(partDir);

    const bomPath = path.join(partDir, 'BOM.txt');
    fs.writeFileSync(
      bomPath,
      'Qty  Name                Url\n2    M3x4x5 Heat Set Inserts    https://amzn.to/example\n',
      'utf8'
    );

    const state = createState();
    const copyImagesFn = jest.fn(); // avoid real file operations
    scanDirectory(sectionDir, 'TestSection', { modelsPath, imagesOutputPath, state, copyImagesFn });

    expect(state.parts).toHaveLength(1);
    expect(state.parts[0]).toMatchObject({
      name: 'TestPart',
      section: 'TestSection',
      hasBOM: true,
    });

    const bomEntries = state.parts[0].bom;
    expect(bomEntries).toHaveLength(1);
    expect(bomEntries[0]).toMatchObject({
      name: 'M3x4x5 Heat Set Inserts',
      qty: 2,
    });
  });

  test('wing sets inherit shared BOM and merge specific BOM items (without moving files)', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'exoguitar-wingsets-'));
    const modelsPath = path.join(root, 'models');
    const imagesOutputPath = path.join(root, 'images-out');
    fs.mkdirSync(modelsPath);

    const wingSetsDir = path.join(modelsPath, 'Wing Sets');
    fs.mkdirSync(wingSetsDir);

    // Shared BOM for all wing sets
    const sharedBomPath = path.join(wingSetsDir, 'BOM.txt');
    fs.writeFileSync(
      sharedBomPath,
      [
        'Qty  Name                Url',
        '2    Shared Screw        https://amzn.to/shared',
      ].join('\n'),
      'utf8'
    );

    // Wing set with its own BOM
    const arasakaDir = path.join(wingSetsDir, 'Arasaka');
    fs.mkdirSync(arasakaDir);
    const arasakaBomPath = path.join(arasakaDir, 'BOM.txt');
    fs.writeFileSync(
      arasakaBomPath,
      [
        'Qty  Name                Url',
        '3    Specific Bolt       https://amzn.to/specific',
      ].join('\n'),
      'utf8'
    );

    // Wing set without its own BOM
    const plasticXDir = path.join(wingSetsDir, 'Plastic X');
    fs.mkdirSync(plasticXDir);

    const state = createState();
    const copyImagesFn = jest.fn(); // avoid real file operations
    scanDirectory(wingSetsDir, 'Wing Sets', { modelsPath, imagesOutputPath, state, copyImagesFn });

    // We should have two parts, one per wing set variant
    const partNames = state.parts.map((p) => p.name).sort();
    expect(partNames).toEqual(['Arasaka', 'Plastic X'].sort());

    const arasakaPart = state.parts.find((p) => p.name === 'Arasaka');
    const plasticPart = state.parts.find((p) => p.name === 'Plastic X');

    // Arasaka: shared + specific items
    const arasakaBomNames = arasakaPart.bom.map((i) => i.name).sort();
    expect(arasakaBomNames).toEqual(['Shared Screw', 'Specific Bolt'].sort());
    const arasakaShared = arasakaPart.bom.find((i) => i.name === 'Shared Screw');
    const arasakaSpecific = arasakaPart.bom.find((i) => i.name === 'Specific Bolt');
    expect(arasakaShared.qty).toBe(2);
    expect(arasakaSpecific.qty).toBe(3);

    // Plastic X: shared items only
    const plasticBomNames = plasticPart.bom.map((i) => i.name);
    expect(plasticBomNames).toEqual(['Shared Screw']);
    expect(plasticPart.bom[0].qty).toBe(2);

    // Unified BOM should have aggregated quantities: shared counted for both wings
    const unifiedItems = Array.from(state.unifiedBOM.values());
    const unifiedShared = unifiedItems.find((i) => i.name === 'Shared Screw');
    const unifiedSpecific = unifiedItems.find((i) => i.name === 'Specific Bolt');
    expect(unifiedShared.qty).toBe(4);
    expect(unifiedSpecific.qty).toBe(3);
  });
});

