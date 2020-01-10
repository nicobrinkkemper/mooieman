// /** combined functions of object as one function */
// type combinedCreatorObj<O extends { [k: string]: AnyFunction }> = (...args: Parameters<O[keyof O]>) => ReturnType<O[keyof O]>
// /**
//  * Returns a function that recursively calls all functions -with the same arguments- in a array and combines results
//  */
// type combineCreatorsObj = <O extends { [k: string]: AnyFunction }>(obj: O) => combinedCreatorObj<O>
// const combineCreatorsObj: combineCreatorsObj = (obj) => combineCreatorsArr(...Object.values(obj))