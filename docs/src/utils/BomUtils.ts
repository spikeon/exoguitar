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