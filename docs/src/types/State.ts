import { Part } from './Parts'

export enum GuitarType {
    ACCOUSTIC, ELECTRIC
}

export interface GeneratorState {
    guitarType?: GuitarType
    neck?: Part
    head?: Part
    wingSet?: Part
    facePlate?: Part
    bridge?: Part
    extras: Part[]
}