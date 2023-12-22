/** because "dashing" implies speed */
type Dasher = '💨';

/** representing dancing or grace */
type Dancer = '💃';

/** a deer, prancing */
type Prancer = '🦌';

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = '🌟';

/** for the celestial body that shares its name */
type Comet = '☄️';

/** symbolizing love, as Cupid is the god of love */
type Cupid = '❤️';

/** representing thunder, as "Donner" means thunder in German */
type Donner = '🌩️';

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = '⚡';

/** for his famous red nose */
type Rudolph = '🔴';

type Reindeer = Dasher | Dancer | Prancer | Vixen | Comet | Cupid | Donner | Blitzen | Rudolph;

type Triple = [Reindeer, Reindeer, Reindeer];
type Row = [Triple, Triple, Triple];
type Board = [Row, Row, Row, Row, Row, Row, Row, Row, Row];

type RowLength = Row['length'];
type BoardLength = Board['length'];

type ArrayUnique<TArray extends Reindeer[], TAccumulator extends Reindeer = never> =
    TArray extends [infer K extends Reindeer, ...infer Rest extends Reindeer[]]
        ? K extends TAccumulator
            ? false
            : ArrayUnique<Rest, TAccumulator | K>
        : true;

type RowFlatten<TRow extends Triple[], TResult extends Reindeer[] = []> =
    TRow extends [infer K extends Triple, ...infer Rest extends Triple[]]
        ? RowFlatten<Rest, [...TResult, ...K]>
        : TResult;

type BoardCol<TBoard extends Row[], TIndex extends number, TResult extends Reindeer[] = []> =
    TResult['length'] extends BoardLength
        ? TResult
        : BoardCol<TBoard, TIndex, [...TResult, RowFlatten<TBoard[TResult['length']]>[TIndex]]>

type BoardZone<TBoard extends Row[], TColIndex extends number, TSkipRows extends 0[], TResult extends Reindeer[] = []> =
    TResult['length'] extends BoardLength
        ? TResult
        : BoardZone<TBoard, TColIndex, [...TSkipRows, 0], [...TResult, ...TBoard[TSkipRows['length']][TColIndex]]>

type BoardRowsValid<TBoard extends Row[]> =
    TBoard extends [infer R extends Row, ...infer Rest extends Row[]]
        ? ArrayUnique<RowFlatten<R>> extends false
            ? false
            : BoardRowsValid<Rest>
        : true;

type BoardColsValid<TBoard extends Row[], TProcessed extends 0[] = []> =
    TProcessed['length'] extends BoardLength
        ? true
        : ArrayUnique<BoardCol<TBoard, TProcessed['length']>> extends false
            ? false
            : BoardColsValid<TBoard, [...TProcessed, 0]>;

type BoardZonesValid<TBoard extends Row[], TSkipCols extends 0[] = [], TSkipRows extends 0[] = []> =
    TSkipRows['length'] extends BoardLength
        ? true
        : TSkipCols['length'] extends RowLength
            ? BoardZonesValid<TBoard, [], [...TSkipRows, 0, 0, 0]>
            : ArrayUnique<BoardZone<TBoard, TSkipCols['length'], TSkipRows>> extends false
                ? false
                : BoardZonesValid<TBoard, [...TSkipCols, 0], TSkipRows>

type Validate<T extends Board> =
    BoardRowsValid<T> extends true
        ? BoardColsValid<T> extends true
            ? BoardZonesValid<T>
            : false
        : false;
