type Connect4Chips = '🔴' | '🟡';
type Connect4Cell = Connect4Chips | '  ';
type Connect4State = '🔴' | '🟡' | '🔴 Won' | '🟡 Won' | 'Draw';

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type Connect4EmptyCell = '  ';
type Connect4Board = Connect4Cell[][];
type Connect4Game = {
  board: Connect4Board;
  state: Connect4State;
};

type WinLength = 4;

type ArrayCount<TArray extends unknown[], TItem, TResult extends unknown[] = []> =
  TArray extends [infer K, ...infer Rest]
    ? K extends TItem  
      ? ArrayCount<Rest, TItem, [...TResult, 0]>
      : ArrayCount<Rest, TItem, TResult>
    : TResult['length'];

type ArrayFlatten<TArray extends unknown[], TResult extends unknown[] = []> =
  TArray extends [infer K, ...infer Rest]
    ? K extends unknown[]
      ? ArrayFlatten<Rest, [...TResult, ...ArrayFlatten<K>]>
      : ArrayFlatten<Rest, [...TResult, K]>
    : TResult;

type ArrayReplace<TArray extends unknown[], TIndex extends number, TItem, TResult extends unknown[] = []> =
  TResult['length'] extends TArray['length']
    ? TResult
    : TResult['length'] extends TIndex
      ? ArrayReplace<TArray, TIndex, TItem, [...TResult, TItem]>
      : ArrayReplace<TArray, TIndex, TItem, [...TResult, TArray[TResult['length']]]>;

type Indexer<T extends number, TResult extends 0[] = []> = TResult['length'] extends T ? TResult : Indexer<T, [...TResult, 0]>;

type ArrayShift<TArray extends unknown[], TIndexer extends 0[], TResult extends unknown[] = []> =
  TResult['length'] extends TArray['length']
    ? TResult
    : TIndexer['length'] extends TArray['length']
      ? ArrayShift<TArray, [0], [...TResult, TArray[0]]>
      : ArrayShift<TArray, [...TIndexer, 0], [...TResult, TArray[TIndexer['length']]]>

type MatrixCol<TMatrix extends unknown[][], TIndex extends number, TResult extends unknown[] = []> =
  TResult['length'] extends TMatrix['length']
    ? TResult
    : MatrixCol<TMatrix, TIndex, [...TResult, TMatrix[TResult['length']][TIndex]]>

type ShiftBoardLeft<TBoard  extends Connect4Cell[][], TResult extends unknown[][] = []> =
  TBoard extends [infer R extends Connect4Cell[], ...infer Rest extends Connect4Cell[][]]
    ? ShiftBoardLeft<Rest, [...TResult, ArrayShift<R, Indexer<TResult['length']>>]>
    : TResult;

type ShiftBoardRight<TBoard  extends Connect4Cell[][], TResult extends unknown[][] = []> =
  TBoard extends [...infer Rest extends Connect4Cell[][], infer R extends Connect4Cell[]]
    ? ShiftBoardRight<Rest, [ArrayShift<R, Indexer<TResult['length']>>, ...TResult]>
    : TResult;

type WinnerOrContinue<TWinner, TContinue> = TWinner extends Connect4Chips ? TWinner : TContinue;
type WinnerStateOrContinue<TWinner, TContinue> = TWinner extends Connect4Chips ? `${TWinner} Won` : TContinue;

type CheckWinnerArray<TArray extends Connect4Cell[], RMatch extends 0[] = [], YMatch extends 0[] = []> =
  TArray extends [infer K, ...infer Rest extends Connect4Cell[]]
    ? K extends '🔴'
      ? WinnerOrContinue<[...RMatch, 0]['length'] extends WinLength ? '🔴' : null, CheckWinnerArray<Rest, [...RMatch, 0], []>>
      : K extends '🟡'
        ? WinnerOrContinue<[...YMatch, 0]['length'] extends WinLength ? '🟡' : null, CheckWinnerArray<Rest, [], [...YMatch, 0]>>
        : CheckWinnerArray<Rest, [], []>
    : null;

type CheckWinnerRow<TBoard extends Connect4Cell[][]> =
  TBoard extends [infer R extends Connect4Cell[], ...infer Rest extends Connect4Cell[][]]
    ? WinnerOrContinue<CheckWinnerArray<R>, CheckWinnerRow<Rest>>
    : null;

type CheckWinnerCol<TBoard extends Connect4Cell[][], TProcessed extends 0[] = []> =
  TProcessed['length'] extends TBoard[0]['length']
    ? null
    : WinnerOrContinue<CheckWinnerArray<MatrixCol<TBoard, TProcessed['length']>>, CheckWinnerCol<TBoard, [...TProcessed, 0]>>

type CheckWinnerDiag<TBoard extends Connect4Cell[][]> = WinnerOrContinue<CheckWinnerCol<ShiftBoardLeft<TBoard>>, CheckWinnerCol<ShiftBoardRight<TBoard>>>

type NextBoard<TBoard extends Connect4Board, TMove extends number, TChip extends Connect4Chips, TProcessed extends 0[] = [], TLast extends number = 0> =
  TProcessed['length'] extends TBoard['length']
    ? ArrayReplace<TBoard, TLast, ArrayReplace<TBoard[TLast], TMove, TChip>>
    : TBoard[TProcessed['length']][TMove] extends Connect4Chips
      ? TLast extends TProcessed['length']
        ? null
        : ArrayReplace<TBoard, TLast, ArrayReplace<TBoard[TLast], TMove, TChip>>
      : NextBoard<TBoard, TMove, TChip, [...TProcessed, 0], TProcessed['length']>;

type NextState<TBoard extends Connect4Board, TState> =
  WinnerStateOrContinue<
    CheckWinnerRow<TBoard>,
    WinnerStateOrContinue<
      CheckWinnerCol<TBoard>,
      WinnerStateOrContinue<
        CheckWinnerDiag<TBoard>,
        ArrayCount<ArrayFlatten<TBoard>, Connect4EmptyCell> extends 0
          ? 'Draw'
          : Exclude<Connect4Chips, TState>
      >
    >
  >;

type NextGame<TGame extends Connect4Game, TBoard extends Connect4Board | null> =
  TBoard extends null
    ? TGame
    : {
      board: TBoard,
      state: NextState<Exclude<TBoard, null>, TGame['state']>,
    };

type Connect4<TGame extends Connect4Game, TMove extends number> = TGame['state'] extends Connect4Chips
  ? NextGame<TGame, NextBoard<TGame['board'], TMove, TGame['state']>>
  : TGame;
