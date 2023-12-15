type AppendGood<TChildren> = { [TName in keyof TChildren as TName extends string ? `good_${TName}` : TName]: TChildren[TName] };
