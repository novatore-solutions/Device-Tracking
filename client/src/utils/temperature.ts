// const fToC = (temp: number) => (temp - 32) / 1.8;
const cToF = (temp: number) => (9 * temp + 160) / 5;

export const handleTempUnit = (value: number, unit: string): string => {
    if (unit === 'c') return `${value} °C`;

    let temp = cToF(value);
    if (!temp) return 'N/A';
    temp = parseInt(temp.toString());

    return `${temp} °F`;
};
