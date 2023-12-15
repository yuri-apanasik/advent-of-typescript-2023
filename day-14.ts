type NamesSplitter<TAccumulator extends Array<string>, TCurrent extends string, TRest extends string> = TRest extends `${infer K}${infer R}`
  ? K extends '/' ? NamesSplitter<[...TAccumulator, TCurrent], '', R> : NamesSplitter<TAccumulator, `${TCurrent}${K}`, R>
  : [...TAccumulator, TCurrent][never];
type DecipherNaughtyList<T extends string> = NamesSplitter<[], '', T>;
