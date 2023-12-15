type SantasList<TBad extends Readonly<Array<any>>, TGood extends Readonly<Array<any>>> = [...TBad, ...TGood];
