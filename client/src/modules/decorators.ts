import debounce from 'lodash.debounce';

export const Debounce = (delay: number) => {
    // eslint-disable-next-line
    return (target: any, prop: string) => {
        return {
            configurable: true,
            enumerable: false,
            value: debounce(target[prop], delay),
        };
    };
};
