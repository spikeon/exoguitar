import {Material} from "../types/Materials"
import { Part } from "../types/Parts"

export const generateCombinedBOM = (parts: Part[]) => {
    const materials: Material[] = []
    for(const part of parts){
        if(!part) continue;
        if(!part.bom) continue;
        for(const mat of part.bom){
            const mid = materials.findIndex((m) => m.name === mat.name);
            if(mid === -1) materials.push(mat);
            else {
                materials[mid].qty += mat.qty;
                if(!materials[mid].amazon_url && mat.amazon_url) materials[mid].amazon_url = mat.amazon_url;
            }
        }
    }
    return materials;
}

export const generateMinimumCombinedBom = (parts: Part[]) => {
    const sectionedMaterials:{[key: string]:Material[]} = {};
    const sections: string[] = [];

    for(const part of parts){
        if(sectionedMaterials[part.section] === undefined) sectionedMaterials[part.section] = []
        if(!sections.includes(part.section)) sections.push(part.section);

        if(!part) continue;
        if(!part.bom) continue;

        for(const mat of part.bom){
            const mid = sectionedMaterials[part.section].findIndex((m) => m.name === mat.name);
            if(mid === -1) sectionedMaterials[part.section].push(mat);
            else {
                const currentQty = sectionedMaterials[part.section][mid].qty
                sectionedMaterials[part.section][mid].qty = currentQty > mat.qty ? currentQty : mat.qty;
                if(!sectionedMaterials[part.section][mid].amazon_url && mat.amazon_url) sectionedMaterials[part.section][mid].amazon_url = mat.amazon_url;
            }
        }

    }

    var materials: Material[] = [];
    for(const section of sections){
        for(const mat of sectionedMaterials[section]){            
            const mid = materials.findIndex((m) => m.name === mat.name);
            if(mid === -1) materials.push(mat);
            else {
                materials[mid].qty += mat.qty;
                if(!materials[mid].amazon_url && mat.amazon_url) materials[mid].amazon_url = mat.amazon_url;
            }
        }
    }

    return materials;
}