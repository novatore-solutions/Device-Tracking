import { Dictionary } from '@/types/base';

export const filterObj = (
    src: Dictionary,
    { dropNull, dropUndefined } = { dropNull: false, dropUndefined: true },
): Dictionary => {
    const result: Dictionary = {};

    Object.keys(src).forEach((key) => {
        if (typeof src[key] === 'string' && !src[key]) return;
        if (typeof src[key] === 'undefined' && dropUndefined) return;
        if (src[key] === null && dropNull) return;

        result[key] = src[key];
    });

    return result;
};
