type Reverse<T extends string> = T extends `${infer K}${infer Rest}` ? `${Reverse<Rest>}${K}` : T;
