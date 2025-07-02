import { Part } from './Parts'

export enum GuitarType {
    ACCOUSTIC, ELECTRIC
}

export enum NeckType {
    PRINTED, WOOD
}

export interface GeneratorState {
    guitarType?: GuitarType
    neckType?: NeckType
    neck?: Part
    head?: Part
    wingSet?: Part
    facePlate?: Part
    bridge?: Part
    extras: Part[]
}