import reducer from './reducer';
import initialState from './initialState';
import { ACTION } from './types';
import { GuitarType } from '../../types/State';
import { Part } from '../../types/Parts';

const mockPart: Part = {
    name: 'Test Part',
    section: 'Head',
    path: 'Head/Test',
    hasBOM: true,
    hasAssembly: true,
};

describe('generatorState reducer', () => {
    it('SET_GUITAR_TYPE updates guitarType', () => {
        const state = reducer(initialState, {
            type: ACTION.SET_GUITAR_TYPE,
            payload: { guitarType: GuitarType.ELECTRIC },
        });
        expect(state.guitarType).toBe(GuitarType.ELECTRIC);
    });

    it('SET_HEAD updates head', () => {
        const state = reducer(initialState, {
            type: ACTION.SET_HEAD,
            payload: { head: mockPart },
        });
        expect(state.head).toEqual(mockPart);
    });

    it('SET_BRIDGE updates bridge', () => {
        const state = reducer(initialState, {
            type: ACTION.SET_BRIDGE,
            payload: { bridge: mockPart },
        });
        expect(state.bridge).toEqual(mockPart);
    });

    it('ADD_EXTRA appends to extras', () => {
        let state = reducer(initialState, {
            type: ACTION.ADD_EXTRA,
            payload: { part: mockPart },
        });
        expect(state.extras).toHaveLength(1);
        expect(state.extras[0]).toEqual(mockPart);

        const part2 = { ...mockPart, name: 'Extra 2' };
        state = reducer(state, { type: ACTION.ADD_EXTRA, payload: { part: part2 } });
        expect(state.extras).toHaveLength(2);
        expect(state.extras[1].name).toBe('Extra 2');
    });

    it('RESET restores initialState', () => {
        let state = reducer(initialState, {
            type: ACTION.SET_HEAD,
            payload: { head: mockPart },
        });
        state = reducer(state, { type: ACTION.RESET, payload: {} });
        expect(state.head).toBeUndefined();
        expect(state).toEqual(initialState);
    });
});
