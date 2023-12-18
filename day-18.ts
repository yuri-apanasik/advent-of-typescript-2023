type Counter<TSack, TToy, TAccumulator extends number[] = []> = TSack extends [infer K, ...infer Rest]
  ? K extends TToy
    ? Counter<Rest, TToy, [...TAccumulator, 0]>
    : Counter<Rest, TToy, TAccumulator>
  : TAccumulator['length'];

type Count<TSack, TToy> = Counter<TSack, TToy>;
