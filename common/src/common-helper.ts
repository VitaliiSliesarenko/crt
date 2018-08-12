export interface ClazzStatic {
    new(): any;
    _etalon?: ClazzStatic;
}

export class CommonHelper {
    public static copyAndVerifyLowLevelTypes<T>(source: T, target: T, Clazz: ClazzStatic, callback?: (s: T, t: T) => void): T {
        // cache etalon instance
        const etalon: any = Clazz._etalon != null
            ? Clazz._etalon
            : Clazz._etalon = new Clazz();
        target = target != null
            ? target
            : new Clazz();
        if (source != null) {
            for (const attr in etalon) {
                if (typeof etalon[attr] === "function") { continue; }
                const def = etalon[attr];
                const val: any = (source as any)[attr];

                if (val == null) {
                    (target as any)[attr] = def;
                } else {
                    if (def != null && (typeof(val) != typeof(def) || (Array.isArray(val) != Array.isArray(def)))) { continue; }
                    (target as any)[attr] = val;
                }
            }
        }
        if (callback) {
            callback(source || etalon, target);
        }
        return target;
    }

}