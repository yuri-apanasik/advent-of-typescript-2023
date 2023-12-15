type Box<TName extends string, TLength, TCurrent extends Array<string>> = TCurrent['length'] extends TLength ? TCurrent : Box<TName, TLength, [...TCurrent, TName]>;
type SuperBox<TName extends string, TLengthTape extends number> = {
	[key in TLengthTape]: Box<TName, key, []>;
};
type BoxToys<TName extends string, TLengthTape extends number> = SuperBox<TName, TLengthTape>[TLengthTape];
