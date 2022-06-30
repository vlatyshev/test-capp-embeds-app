/* eslint-disable @typescript-eslint/no-explicit-any */
export type ThrottleFunc = (...args: any[]) => void;

export const throttle = (func: ThrottleFunc, ms: number) => {
    let lastRan = Date.now();
    let handler: any = null;

    return (...args: any[]) => {
        if (handler !== null) {
            clearTimeout(handler);
        }
        handler = setTimeout(() => {
            if (Date.now() - lastRan >= ms) {
                func(...args);
                lastRan = Date.now();
            }
        }, ms - (Date.now() - lastRan));
    };
};
