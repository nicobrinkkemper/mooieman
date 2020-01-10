export function attachToDefault<T extends { default: CallableFunction }>(spec: T): T & T['default'] {
    return Object.assign(
        spec.default,
        spec
    )
}
export default attachToDefault