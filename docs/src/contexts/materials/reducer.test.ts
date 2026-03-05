import reducer from './reducer';
import initialState from './initialState';
import { ACTION } from './types';
import { Material } from '../../types/Materials';

const mockMaterial: Material = {
    name: 'M3x8 Screw',
    amazon_url: 'https://amzn.to/x',
    qty: 4,
    optional: false,
};

describe('materials reducer', () => {
    it('SET_BILL_OF_MATERIALS replaces Materials', () => {
        const materials: Material[] = [mockMaterial];
        const state = reducer(initialState, {
            type: ACTION.SET_BILL_OF_MATERIALS,
            payload: { Materials: materials },
        });
        expect(state.Materials).toEqual(materials);
        expect(state.Materials).toHaveLength(1);
    });

    it('ADD_BILL_OF_MATERIALS_MATERIAL adds material to empty list', () => {
        const state = reducer(initialState, {
            type: ACTION.ADD_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: mockMaterial },
        });
        expect(state.Materials).toHaveLength(1);
        expect(state.Materials[0]).toEqual(mockMaterial);
    });

    it('ADD_BILL_OF_MATERIALS_MATERIAL replaces existing material with same name', () => {
        const first: Material = { ...mockMaterial, qty: 2 };
        const second: Material = { ...mockMaterial, qty: 5 };
        let state = reducer(initialState, {
            type: ACTION.ADD_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: first },
        });
        state = reducer(state, {
            type: ACTION.ADD_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: second },
        });
        expect(state.Materials).toHaveLength(1);
        expect(state.Materials[0].qty).toBe(5);
    });

    it('UPDATE_BILL_OF_MATERIALS_MATERIAL adds qty to existing material', () => {
        let state = reducer(initialState, {
            type: ACTION.SET_BILL_OF_MATERIALS,
            payload: { Materials: [{ ...mockMaterial, qty: 3 }] },
        });
        state = reducer(state, {
            type: ACTION.UPDATE_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: { ...mockMaterial, qty: 2 } },
        });
        expect(state.Materials).toHaveLength(1);
        expect(state.Materials[0].qty).toBe(5);
    });

    it('UPDATE_BILL_OF_MATERIALS_MATERIAL adds new material when name not present', () => {
        const state = reducer(initialState, {
            type: ACTION.UPDATE_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: mockMaterial },
        });
        expect(state.Materials).toHaveLength(1);
        expect(state.Materials[0].qty).toBe(mockMaterial.qty);
    });

    it('REMOVE_BILL_OF_MATERIALS_MATERIAL removes material by name', () => {
        let state = reducer(initialState, {
            type: ACTION.SET_BILL_OF_MATERIALS,
            payload: {
                Materials: [
                    mockMaterial,
                    { ...mockMaterial, name: 'Other', qty: 1 },
                ],
            },
        });
        state = reducer(state, {
            type: ACTION.REMOVE_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: mockMaterial },
        });
        expect(state.Materials).toHaveLength(1);
        expect(state.Materials[0].name).toBe('Other');
    });

    it('REMOVE_BILL_OF_MATERIALS_MATERIAL is no-op when material not in list', () => {
        let state = reducer(initialState, {
            type: ACTION.SET_BILL_OF_MATERIALS,
            payload: { Materials: [mockMaterial] },
        });
        state = reducer(state, {
            type: ACTION.REMOVE_BILL_OF_MATERIALS_MATERIAL,
            payload: { material: { ...mockMaterial, name: 'NotInList' } },
        });
        expect(state.Materials).toHaveLength(1);
        expect(state.Materials[0].name).toBe('M3x8 Screw');
    });
});
