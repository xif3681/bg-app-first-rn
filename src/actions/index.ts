export type ActionFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => ReturnType<ReturnType<T>>;

export type IgnoreParametersActionFunction<T extends (...args: any[]) => any> = (...args: any) => ReturnType<ReturnType<T>>;

export default {}