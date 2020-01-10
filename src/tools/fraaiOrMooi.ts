type FraaiOrMooi = (_input: string | string[]) => string
type FraaiOrMooiMismatched = Array<{str:string,mismatched:number}>;
export const fraaiOrMooi:FraaiOrMooi = (_input)=> {
    const options = ['fraaievrouw', 'mooieman']
    const input = Object.values(_input)
        .join('')
        .toLowerCase()
        .replace(/[^A-Za-z]/g, "") // may only be letters
    const found = options.indexOf(input);
    if (found !== -1) return options[found]
    // mitigate the not-found by intersecting each character and finding a good candidate
    const splitInput = input.split('') // is pre-splitted for later repeated use
    return (options.reduce<FraaiOrMooiMismatched>((arr, str) => {
        arr.push({
            str,
            // get the amount of mismatched characters relative to string
            mismatched: str.length - str.split('').filter(x => splitInput.indexOf(x) === -1).length
        })
        return arr
    }, []).sort(
        (a, b) => b.mismatched - a.mismatched // sort least mismatching first
    )[0].str)
}
export default fraaiOrMooi;