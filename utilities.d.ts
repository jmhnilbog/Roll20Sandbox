/**
 * Union type of values of an indexable type.
 */
type Values<T extends Indexed> = T[keyof T];

/**
 * Union type of keys of an indexable type.
 */
type Keys<T extends Indexed> = keyof T;

/**
 * Permutations of union types X and Y as strings, using
 * separator Z.
 */
type Permuted<
    X extends Index,
    Y extends Index,
    Z extends string = "-"
> = Values<
    {
        [V in X]: Values<
            {
                [H in Y]: Values<
                    {
                        [K in V | H]: `${V}${Z}${H}`;
                    }
                >;
            }
        >;
    }
>;

type Unwrap<T> = T extends Promise<infer U>
    ? U
    : T extends (...args: any) => Promise<infer U>
    ? U
    : T extends (...args: any) => infer U
    ? U
    : T;

/**
 * Removed readonly attribute from named keys.
 */
type Mutable<T, K extends keyof T = keyof T> = Omit<T, K> &
    {
        -readonly [key in K]: T[key];
    };

/**
 * Makes named keys required.
 */
type Require<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
    Required<Pick<T, K>>;

type Primitive = string | number | bigint | boolean | symbol | null | undefined;

type Diff<T extends object, U extends object> = Pick<
    T,
    SetDifference<keyof T, keyof U>
>;
type SetDifference<A, B> = A extends B ? never : A;
type Intersection<T extends object, U extends object> = Pick<
    T,
    Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

type Assign<
    T extends object,
    U extends object,
    I = Diff<T, U> & Intersection<U, T> & Diff<U, T>
> = Pick<I, keyof I>;

type Brand<K, T extends string> = K & { __brand: `${T}` };
