export interface Part {
    name: string
    section: string
    path: string
    hasBOM: boolean
    hasAssembly: boolean
    incompatibleParts?: string[]
    reqiresParts?: string[]
    extra2020Length?: number
    thumb?: string
}

export interface Section {
    name: string
    parts?: Part[]
    incompatibleSections?: string[]
}