type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type Santa = "🎅";
type Tree = "🎄";

type Indexer<T extends number, TResult extends 0[] = []> = TResult['length'] extends T ? TResult : Indexer<T, [...TResult, 0]>;
type IndexerInc<T extends 0[] | null, TMax extends number> = T extends 0[] ? [...T, 0]['length'] extends TMax ? null : [...T, 0] : [];
type IndexerDec<T extends 0[] | null> = T extends [0, ...infer Rest extends 0[]] ? Rest : null;

type InnerPosition = { row: 0[]; col: 0[] };
type Position = { row: 0[] | null; col: 0[] | null };

type FindSantaRow<TRow> = TRow extends [...infer P, Santa] ? P['length'] : TRow extends [...infer P, infer _] ? FindSantaRow<P> : '';
type FindSanta<TMaze> = TMaze extends [...infer TRest, infer TRow]
	? FindSantaRow<TRow> extends number ? { row: Indexer<TRest['length']>, col: Indexer<FindSantaRow<TRow>> } : FindSanta<TRest>
	: null;

type NextPosition<TMaze extends MazeMatrix, TPosition extends Position, TMove extends Directions> = {
    'up': { row: IndexerDec<TPosition['row']>, col: TPosition['col'] },
    'down': { row: IndexerInc<TPosition['row'], TMaze['length']>, col: TPosition['col'] },
    'left': { row: TPosition['row'], col: IndexerDec<TPosition['col']> },
    'right': { row: TPosition['row'], col: IndexerInc<TPosition['col'], TMaze[0]['length']> },
}[TMove];

type EnsureInnerPosition<TPosition extends Position> =
    TPosition['row'] extends 0[]
        ? TPosition['col'] extends 0[]
            ? { row: TPosition['row'], col: TPosition['col'] }
            : null
        : null;

type CookieMazeRow<TRow extends MazeItem[], TResult extends DELICIOUS_COOKIES[] = []> =
    TRow extends [MazeItem, ...infer Rest extends MazeItem[]]
        ? CookieMazeRow<Rest, [...TResult, DELICIOUS_COOKIES]>
        : TResult;

type CookieMaze<TMaze extends MazeMatrix, TResult extends DELICIOUS_COOKIES[][] = []> =
    TMaze extends [infer Row extends MazeItem[], ...infer Rest extends MazeMatrix]
        ? CookieMaze<Rest, [...TResult, CookieMazeRow<Row>]>
        : TResult;

type NextMazeRow<TRow extends MazeItem[], TRowIndex extends number, TNewPosition extends InnerPosition, TResult extends MazeItem[] = []> =
    TRow extends [infer K extends MazeItem, ...infer Rest extends MazeItem[]]
        ? K extends Santa
            ? NextMazeRow<Rest, TRowIndex, TNewPosition, [...TResult, Alley]>
            : TRowIndex extends TNewPosition['row']['length']
                ? TResult['length'] extends TNewPosition['col']['length']
                    ? NextMazeRow<Rest, TRowIndex, TNewPosition, [...TResult, Santa]>
                    : NextMazeRow<Rest, TRowIndex, TNewPosition, [...TResult, K]>
                : NextMazeRow<Rest, TRowIndex, TNewPosition, [...TResult, K]>
        : TResult;

type NextMaze<TMaze extends MazeMatrix, TSantaPosition extends Position, TNewPosition extends InnerPosition, TResult extends MazeMatrix = []> = 
    TMaze extends [infer Row extends MazeItem[], ...infer Rest extends MazeMatrix]
        ? NextMaze<Rest, TSantaPosition, TNewPosition, [...TResult, NextMazeRow<Row, TResult['length'], TNewPosition>]>
        : TResult;

type MoveToAlley<TMaze extends MazeMatrix, TSantaPosition extends InnerPosition, TNewPosition extends Position, TInnerPosition = EnsureInnerPosition<TNewPosition>> = 
    TInnerPosition extends InnerPosition
        ? TMaze[TInnerPosition['row']['length']][TInnerPosition['col']['length']] extends Alley
            ? NextMaze<TMaze, TSantaPosition, TInnerPosition>
            : TMaze
        : CookieMaze<TMaze>;

type MoveWithSanta<TMaze extends MazeMatrix, TMove extends Directions, TSantaPosition extends InnerPosition | null> =
    TSantaPosition extends Position
        ? MoveToAlley<TMaze, TSantaPosition, NextPosition<TMaze, TSantaPosition, TMove>>
        : TMaze;

type Move<TMaze extends MazeMatrix, TMove extends Directions> = MoveWithSanta<TMaze, TMove, FindSanta<TMaze>>;
  