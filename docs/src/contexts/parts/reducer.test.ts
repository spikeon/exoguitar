import reducer from './reducer';
import { ACTION } from './types';
import { Part } from '../../types/Parts';

const initialState = { parts: [] as Part[], sections: [] as { name: string; parts: Part[] }[] };

const mockPart: Part = {
    name: 'Test Part',
    section: 'Head',
    path: 'Head/Test Part',
    hasBOM: true,
    hasAssembly: true,
};

describe('parts reducer', () => {
    it('SET_PARTS replaces parts', () => {
        const parts: Part[] = [mockPart];
        const state = reducer(initialState, {
            type: ACTION.SET_PARTS,
            payload: { parts },
        });
        expect(state.parts).toEqual(parts);
        expect(state.parts).toHaveLength(1);
    });

    it('SET_PARTS replaces previous parts', () => {
        const first: Part[] = [{ ...mockPart, name: 'First' }];
        const second: Part[] = [{ ...mockPart, name: 'Second' }];
        let state = reducer(initialState, { type: ACTION.SET_PARTS, payload: { parts: first } });
        state = reducer(state, { type: ACTION.SET_PARTS, payload: { parts: second } });
        expect(state.parts).toHaveLength(1);
        expect(state.parts[0].name).toBe('Second');
    });
});
