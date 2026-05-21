function trapObject(obj, fn) {
    const proxies = new WeakMap();

    const wrap = (target) => {
        if (target === null || typeof target !== "object") {
            return target;
        }

        if (proxies.has(target)) {
            return proxies.get(target);
        }

        const proxy = new Proxy(target, {
            get(currentTarget, prop) {
                const value = currentTarget[prop];
                fn("get", prop, value);
                return wrap(value);
            },
            set(currentTarget, prop, value) {
                fn("set", prop, currentTarget[prop], value);
                currentTarget[prop] = value;
                return true;
            },
        });

        proxies.set(target, proxy);
        return proxy;
    };

    return wrap(obj);
}
