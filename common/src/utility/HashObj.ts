
export class HashObj<T> {
    set(key: string, value: T) {
        (this as any)[key] = value;
    }

    get(key: string): T {
        return (this as any)[key] as T;
    }

    delete(key: string) {
        delete (this as any)[key];
    }

    has(key: string): boolean {
        return (this as any)[key] != null;
    }

    keys(): Array<string> {
        return Object.keys((this as any));
    }

    values(): Array<T> {
        return Object.keys((this as any)).map(key => (this as any)[key]);
    }

    static createHash<T>(objArr: Array<T>, keyFn: (t: T) => string): HashObj<T> {
        const hash = new HashObj<T>();
        objArr.forEach(o => {
            hash.set(keyFn(o), o);
        });
        return hash;
    }

    static copyAndVerify<T>(source: HashObj<T>, target?: HashObj<T>): HashObj<T> {

        const copy = new HashObj<T>();
        if (target != null) {
            HashObj.copyAttrs(target, copy);
        }
        target = copy;
        if (source != null) {
            HashObj.copyAttrs(source, target);
        }
        return target;
    }

    static hasKey(hashObj: any, key: string): boolean {
        return hashObj.hasOwnProperty(key) && ! (typeof hashObj[key] === 'function');
    }

    private static copyAttrs(source: any, target: any) {
        Object.keys(source).forEach(key => {
            if (HashObj.hasKey(source, key)) {
                target[key] = JSON.parse(JSON.stringify(source[key]));
            }
        });
    }
}
