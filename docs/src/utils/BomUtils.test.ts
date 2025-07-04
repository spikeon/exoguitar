import { Part } from "../types/Parts";
import { generateCombinedBOM, generateMinimumCombinedBom } from "./BomUtils";

describe('BOM Utils: Generate Combined Bom', () => {
    test('test simple list combine', () => {
        const p1: Part = {
            name: "p1",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
                {
                    name: "m2",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m3",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
                {
                    name: "m4",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const result = generateCombinedBOM([p1, p2]);

        expect(result.length).toBe(4);

        console.log(result)

        const rp1 = result.find((p) => p.name == 'm1');
        const rp2 = result.find((p) => p.name == 'm2');
        const rp3 = result.find((p) => p.name == 'm3');
        const rp4 = result.find((p) => p.name == 'm4');

        expect(rp1).toBeDefined();
        expect(rp1?.qty).toBe(3);
        expect(rp1?.amazon_url).toBe("123")
        expect(rp1?.optional).toBe(false)

        expect(rp2).toBeDefined();
        expect(rp2?.qty).toBe(3);
        expect(rp2?.amazon_url).toBe("123")
        expect(rp2?.optional).toBe(false)

        expect(rp3).toBeDefined();
        expect(rp3?.qty).toBe(3);
        expect(rp3?.amazon_url).toBe("123")
        expect(rp3?.optional).toBe(false)

        expect(rp1).toBeDefined();
        expect(rp4?.qty).toBe(3);
        expect(rp4?.amazon_url).toBe("123")
        expect(rp4?.optional).toBe(false)
    });

    test('test quantity combine', () => {
        const p1: Part = {
            name: "p1",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 5,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const result = generateCombinedBOM([p1, p2]);

        const rp1 = result.find((p) => p.name == 'm1');

        expect(rp1).toBeDefined();
        expect(rp1?.qty).toBe(8);
        expect(rp1?.amazon_url).toBe("123")
        expect(rp1?.optional).toBe(false)
    });

    test('test url list combine', () => {
        const p1: Part = {
            name: "p1",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p3: Part = {
            name: "p3",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"",
                    optional: false
                },
            ]
        }

        const p4: Part = {
            name: "p4",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"asd",
                    optional: false
                },
            ]
        }


        const result = generateCombinedBOM([p1, p2, p3, p4]);

        console.log(result)

        const rp1 = result.find((p) => p.name == 'm1');

        expect(rp1).toBeDefined();
        expect(rp1?.qty).toBe(12);
        expect(rp1?.amazon_url).toBe("123")
        expect(rp1?.optional).toBe(false)
    });
});


describe('BOM Utils: Generate Minimum Combined Bom', () => {
    test('test simple list combine', () => {
        const p1: Part = {
            name: "p1",
            section: "a",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
                {
                    name: "m2",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "a",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m3",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
                {
                    name: "m4",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const result = generateMinimumCombinedBom([p1, p2]);

        expect(result.length).toBe(4);

        console.log(result)

        const rp1 = result.find((p) => p.name == 'm1');
        const rp2 = result.find((p) => p.name == 'm2');
        const rp3 = result.find((p) => p.name == 'm3');
        const rp4 = result.find((p) => p.name == 'm4');

        expect(rp1).toBeDefined();
        expect(rp1?.qty).toBe(3);
        expect(rp1?.amazon_url).toBe("123")
        expect(rp1?.optional).toBe(false)

        expect(rp2).toBeDefined();
        expect(rp2?.qty).toBe(3);
        expect(rp2?.amazon_url).toBe("123")
        expect(rp2?.optional).toBe(false)

        expect(rp3).toBeDefined();
        expect(rp3?.qty).toBe(3);
        expect(rp3?.amazon_url).toBe("123")
        expect(rp3?.optional).toBe(false)

        expect(rp1).toBeDefined();
        expect(rp4?.qty).toBe(3);
        expect(rp4?.amazon_url).toBe("123")
        expect(rp4?.optional).toBe(false)
    });

    test('test quantity of single section', () => {
        const p1: Part = {
            name: "p1",
            section: "a",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "a",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 5,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const result = generateMinimumCombinedBom([p1, p2]);

        const rp1 = result.find((p) => p.name == 'm1');

        expect(rp1).toBeDefined();
        expect(rp1?.qty).toBe(5);
        expect(rp1?.amazon_url).toBe("123")
        expect(rp1?.optional).toBe(false)
    });

    test('test quantity of multiple sections', () => {
        const p1: Part = {
            name: "p1",
            section: "a",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "a",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 5,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p3: Part = {
            name: "p3",
            section: "b",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 5,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const result = generateMinimumCombinedBom([p1, p2, p3]);

        const rp1 = result.find((p) => p.name == 'm1');

        expect(rp1).toBeDefined();
        expect(rp1?.qty).toBe(10);
        expect(rp1?.amazon_url).toBe("123")
        expect(rp1?.optional).toBe(false)
    });

    test('test url list combine', () => {
        const p1: Part = {
            name: "p1",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"",
                    optional: false
                },
            ]
        }

        const p2: Part = {
            name: "p2",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"123",
                    optional: false
                },
            ]
        }

        const p3: Part = {
            name: "p3",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"",
                    optional: false
                },
            ]
        }

        const p4: Part = {
            name: "p4",
            section: "",
            path: "",
            hasBOM: true,
            hasAssembly: true,
            bom: [
                {
                    name: "m1",
                    qty: 3,
                    amazon_url:"asd",
                    optional: false
                },
            ]
        }


        const result = generateMinimumCombinedBom([p1, p2, p3, p4]);

        console.log(result)

        const rp1 = result.find((p) => p.name == 'm1');

        expect(rp1).toBeDefined();
        expect(rp1?.amazon_url).toBe("123")
    });
});
