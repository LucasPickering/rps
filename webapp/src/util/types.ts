/**
 * Gets the type of one field from an interface.
 *
 * Stolen from https://stackoverflow.com/a/54432326
 */
export type FieldType<TObj, TProp extends keyof TObj> = TObj[TProp];
