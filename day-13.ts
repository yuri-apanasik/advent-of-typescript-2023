type DayTape<T extends Array<number>, TCount, TLast extends boolean> = T['length'] extends TCount
  ? TLast extends true ? [...T, T['length']] : T
  : DayTape<[...T, T['length']], TCount, TLast>;
type DayCounter<TFrom, TTo> = Exclude<DayTape<[], TTo, true>[never], DayTape<[], TFrom, false>[never]>;
