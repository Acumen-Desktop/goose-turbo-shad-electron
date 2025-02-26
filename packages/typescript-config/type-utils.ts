/**
 * TypeScript Utility Types
 *
 * This file contains common type utilities that can be used throughout the project.
 * Import these types to simplify common typing patterns.
 */

/**
 * Makes all properties of T optional and nullable
 */
export type Nullable<T> = { [P in keyof T]?: T[P] | null };

/**
 * Creates a type that requires at least one of the properties in T
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

/**
 * Creates a type that requires exactly one of the properties in T
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
	}[Keys];

/**
 * Creates a type with all properties of T except those in K
 */
export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Creates a type with only the specified properties of T
 */
export type Only<T, K extends keyof T> = Pick<T, K>;

/**
 * Creates a type that makes some properties of T required
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Creates a type that makes all properties of T readonly
 */
export type Immutable<T> = { readonly [P in keyof T]: T[P] };

/**
 * Creates a type for a function with parameters and return type
 */
export type Func<Args extends any[] = any[], Return = any> = (...args: Args) => Return;

/**
 * Creates a type for an async function with parameters and return type
 */
export type AsyncFunc<Args extends any[] = any[], Return = any> = (
	...args: Args
) => Promise<Return>;

/**
 * Creates a type for a dictionary with string keys and values of type T
 */
export type Dictionary<T> = Record<string, T>;

/**
 * Creates a type for a dictionary with number keys and values of type T
 */
export type NumericDictionary<T> = Record<number, T>;

/**
 * Creates a type for a function that returns a Promise
 */
export type PromiseReturnType<T extends (...args: any) => any> = T extends (
	...args: any
) => Promise<infer R>
	? R
	: never;

/**
 * Creates a type for a constructor function
 */
export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Creates a type that makes all properties of T optional
 * This is the same as Partial<T> but included for completeness
 */
export type Optional<T> = Partial<T>;

/**
 * Creates a type that makes all nested properties of T optional
 */
export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;
