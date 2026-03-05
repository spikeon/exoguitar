import { checkIncompatibilities } from './SectionSelector';
import { Part } from '../types/Parts';

const basePart = (overrides: Partial<Part> = {}): Part => ({
    name: 'Part',
    section: 'Head',
    path: 'Head/Part',
    hasBOM: true,
    hasAssembly: true,
    ...overrides,
});

describe('checkIncompatibilities', () => {
    it('returns true when no parts are selected', () => {
        const part = basePart();
        expect(checkIncompatibilities(part, 'Head', [])).toBe(true);
        expect(checkIncompatibilities(part, 'Head', [undefined, undefined])).toBe(true);
    });

    it('returns true when part has no incompatibilities and no compatibleParts filter', () => {
        const part = basePart({ name: 'Some Head' });
        const selected = [basePart({ name: 'Some Bridge' })];
        expect(checkIncompatibilities(part, 'Head', selected)).toBe(true);
    });

    it('returns false when part lists a selected part in incompatibleParts', () => {
        const part = basePart({ name: 'Wing A', incompatibleParts: ['Bridge X'] });
        const selected = [basePart({ name: 'Bridge X' })];
        expect(checkIncompatibilities(part, 'Wing Sets', selected)).toBe(false);
    });

    it('returns false when a selected part lists this part in incompatibleParts', () => {
        const part = basePart({ name: 'Wing A' });
        const selected = [basePart({ name: 'Bridge X', incompatibleParts: ['Wing A'] })];
        expect(checkIncompatibilities(part, 'Wing Sets', selected)).toBe(false);
    });

    it('returns true when part is in selected part compatibleParts list for section', () => {
        const part = basePart({ name: 'Wing A' });
        const selected = [
            basePart({ name: 'Bridge X', compatibleParts: { 'Wing Sets': ['Wing A', 'Wing B'] } }),
        ];
        expect(checkIncompatibilities(part, 'Wing Sets', selected)).toBe(true);
    });

    it('returns false when part is not in selected part compatibleParts list for section', () => {
        const part = basePart({ name: 'Wing C' });
        const selected = [
            basePart({ name: 'Bridge X', compatibleParts: { 'Wing Sets': ['Wing A', 'Wing B'] } }),
        ];
        expect(checkIncompatibilities(part, 'Wing Sets', selected)).toBe(false);
    });

    it('ignores compatibleParts for other sections', () => {
        const part = basePart({ name: 'Wing C' });
        const selected = [
            basePart({ name: 'Bridge X', compatibleParts: { Head: ['Other'] } }),
        ];
        expect(checkIncompatibilities(part, 'Wing Sets', selected)).toBe(true);
    });

    it('skips undefined selected parts', () => {
        const part = basePart({ name: 'Head A', incompatibleParts: ['Bridge X'] });
        const selected = [undefined, basePart({ name: 'Other' }), undefined];
        expect(checkIncompatibilities(part, 'Head', selected)).toBe(true);
    });
});
