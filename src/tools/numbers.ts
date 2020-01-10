type StringToNumberOrRandom = (_input: string | string[], max: number) => number
type GetRandom = (min: number, max: number) => number
type GetRandomPaddedInt = (min: number, max: number, pad?: number) => string

export const stringToNumberOrRandom: StringToNumberOrRandom = (input, max) => {
    const int = parseInt(Object.values(input).join('').replace(/\D/g, '')) // may only be a integer
    if (isNaN(int) || int > max) return getRandomInt(1, max) // random fallbackk
    return int
}

export const getRandomInt: GetRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandom: GetRandom = (min, max) => {
    return Math.random() * (max - min) + min
}

export const getRandomPaddedInt: GetRandomPaddedInt = (min, max, pad = 4) => {
    return String(getRandomInt(min, max)).padStart(pad, '0')
}