type FindSantaRow<TRow> = TRow extends [...infer P, '🎅🏼'] ? P['length'] : TRow extends [...infer P, infer _] ? FindSantaRow<P> : '';
type FindSanta<TForest> = TForest extends [...infer TRest, infer TRow]
	? FindSantaRow<TRow> extends number ? [TRest['length'], FindSantaRow<TRow>] : FindSanta<TRest>
	: never ;
