export default function deepExport(obj: any): any {
    if (Array.isArray(obj)) {
        const res = [];
        for (const item of obj) {
            res.push(deepExport(item));
        }
        return res;
    } else if (Object.prototype.isPrototypeOf(obj)) {
        const res: any = {};
        for (const key of Object.keys(obj)) {
            res[key] = obj[key];
        }
        return res;
    } else {
        return obj;
    }
}