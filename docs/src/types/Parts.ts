import { Material } from "./Materials"

export interface Part {
    name: string
    section: string
    path: string
    hasBOM: boolean
    hasAssembly: boolean
    incompatibleParts?: string[]
    compatibleParts?: {[key: string]: string[]}
    requiredParts?: string[]
    extra2020Length?: number
    thumb?: string
    bom?: Material[]
    makerWorldUrl?: string
    hidden?: boolean
}

export interface Section {
    name: string
    parts?: Part[]
    incompatibleSections?: string[]
}