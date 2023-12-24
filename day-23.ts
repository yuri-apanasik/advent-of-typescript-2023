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

type MathSub<T1 extends unknown[], T2 extends unknown[]> =
  T1 extends [unknown, ...infer Rest1 extends unknown[]]
    ? T2 extends [unknown, ...infer Rest2 extends unknown[]]
      ? MathSub<Rest1, Rest2>
      : T1['length']
    : 0;

type MatrixCol<TMatrix extends Connect4Cell[][], TIndex extends number, TResult extends Connect4Cell[] = []> =
  TResult['length'] extends TMatrix['length']
    ? TResult
    : MatrixCol<TMatrix, TIndex, [...TResult, TMatrix[TResult['length']][TIndex]]>

type BoardDiagsHoriz<TBoard extends Connect4Cell[][], TStartCol extends 0[] = [], TCol extends 0[] = [], TRow extends 0[] = [], TDiagDown extends Connect4Cell[] = [], TDiagUp extends Connect4Cell[] = [], TResult extends Connect4Cell[][] = []> = 
TStartCol['length'] extends TBoard[0]['length']
  ? TResult
  : TCol['length'] extends TBoard[0]['length']
    ? BoardDiagsHoriz<TBoard, [...TStartCol, 0], [...TStartCol, 0], [], [], [], [...TResult, TDiagDown, TDiagUp]>
    : TRow['length'] extends TBoard['length']
      ? BoardDiagsHoriz<TBoard, [...TStartCol, 0], [...TStartCol, 0], [], [], [], [...TResult, TDiagDown, TDiagUp]>
      : BoardDiagsHoriz<TBoard, TStartCol, [...TCol, 0], [...TRow, 0], [...TDiagDown, TBoard[TRow['length']][TCol['length']]], [...TDiagUp, TBoard[MathSub<TBoard, [...TRow, 0]>][TCol['length']]], TResult>;
      
type BoardDiagsVert<TBoard extends Connect4Cell[][], TStartRow extends 0[] = [0], TCol extends 0[] = [], TRow extends 0[] = [0], TDiagDown extends Connect4Cell[] = [], TDiagUp extends Connect4Cell[] = [], TResult extends Connect4Cell[][] = []> = 
TStartRow['length'] extends TBoard['length']
  ? TResult
  : TCol['length'] extends TBoard[0]['length']
    ? BoardDiagsVert<TBoard, [...TStartRow, 0], [], [...TStartRow, 0], [], [], [...TResult, TDiagDown, TDiagUp]>
    : TRow['length'] extends TBoard['length']
      ? BoardDiagsVert<TBoard, [...TStartRow, 0], [], [...TStartRow, 0], [], [], [...TResult, TDiagDown, TDiagUp]>
      : BoardDiagsVert<TBoard, TStartRow, [...TCol, 0], [...TRow, 0], [...TDiagDown, TBoard[TRow['length']][TCol['length']]], [...TDiagUp, TBoard[MathSub<TBoard, [...TRow, 0]>][TCol['length']]], TResult>;

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

type CheckWinnerDiag<TBoard extends Connect4Cell[][]> = WinnerOrContinue<
  CheckWinnerRow<BoardDiagsHoriz<TBoard>>,
  CheckWinnerRow<BoardDiagsVert<TBoard>>
>;

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
