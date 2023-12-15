type FindSanta<T> = T extends [...infer P, '🎅🏼'] ? P['length'] : T extends [...infer P, infer _] ? FindSanta<P> : never;
