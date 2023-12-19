type PresentTape = ['🛹', '🚲', '🛴', '🏄'];
type Rebuild<TRequest, TRepeat = 0, TAccumulator extends unknown[] = [], TResult extends unknown[] = [], TPresent = PresentTape> =
	TAccumulator['length'] extends TRepeat
		? TRequest extends [infer K, ...infer RequestRest]
			? TPresent extends [infer P, ...infer PresentRest]
				? Rebuild<RequestRest, K, [P], [...TResult, P], PresentRest>
				: Rebuild<TRequest, 0, [], TResult, PresentTape>
			: TResult	
		: Rebuild<TRequest, TRepeat, [...TAccumulator, TAccumulator[0]], [...TResult, TAccumulator[0]], TPresent>;
