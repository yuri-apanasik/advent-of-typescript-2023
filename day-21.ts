type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  '
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTacToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTacToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [
  ['  ', '  ', '  '], 
  ['  ', '  ', '  '], 
  ['  ', '  ', '  ']
];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

type IndexOfY<Y extends TicTacToeYPositions> = Y extends 'top' ? 0 : Y extends 'middle' ? 1 : 2;
type IndexOfX<X extends TicTacToeXPositions> = X extends 'left' ? 0 : X extends 'center' ? 1 : 2;

type ArrayReplace<TArray extends unknown[], TIndex extends number, TItem, TResult extends unknown[] = []> =
    TResult['length'] extends TArray['length']
        ? TResult
        : TResult['length'] extends TIndex 
            ? ArrayReplace<TArray, TIndex, TItem, [...TResult, TItem]>
            : ArrayReplace<TArray, TIndex, TItem, [...TResult, TArray[TResult['length']]]>;

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

type ArrayEqual<TArray extends unknown[], TItem> =
    TArray extends [infer K, ...infer Rest]
        ? K extends TItem
            ? ArrayEqual<Rest, TItem>
            : false
        : true;

type MatrixCol<TMatrix extends unknown[][], TIndex extends number, TResult extends unknown[] = []> =
    TResult['length'] extends TMatrix['length']
        ? TResult
        : MatrixCol<TMatrix, TIndex, [...TResult, TMatrix[TResult['length']][TIndex]]>

type MatrixDiag<TMatrix extends unknown[][], TProcessed extends 0[] = [], TResult extends unknown[] = []> =
    TProcessed['length'] extends TMatrix[0]['length']
        ? TResult
        : MatrixDiag<TMatrix, [...TProcessed, 0], [...TResult, TMatrix[TProcessed['length']][TProcessed['length']]]>

type MatrixRevDiag<TMatrix extends unknown[][], TProcessed extends 0[] = [], TResult extends unknown[] = []> =
    TMatrix extends [...infer Rest extends unknown[][], infer R extends unknown[]]
        ? MatrixRevDiag<Rest, [...TProcessed, 0], [...TResult, R[TProcessed['length']]]>
        : TResult;

type MatrixRowEqual<TMatrix extends unknown[][], TItem> =
    TMatrix extends [infer R extends unknown[], ...infer Rest extends unknown[][]]
        ? ArrayEqual<R, TItem> extends true
            ? true
            : MatrixRowEqual<Rest, TItem>
        : false;

type MatrixColEqual<TMatrix extends unknown[][], TItem, TProcessed extends 0[] = []> =
    TProcessed['length'] extends TMatrix[0]['length']
        ? false
        : ArrayEqual<MatrixCol<TMatrix, TProcessed['length']>, TItem> extends true
            ? true
            : MatrixColEqual<TMatrix, TItem, [...TProcessed, 0]>;

type MatrixDiagEqual<TMatrix extends unknown[][], TItem> =
    ArrayEqual<MatrixDiag<TMatrix>, TItem> extends true
        ? true
        : ArrayEqual<MatrixRevDiag<TMatrix>, TItem> extends true
            ? true
            : false;

type PlayerWon<TBoard extends TicTacToeBoard, TPlayer> =
    MatrixRowEqual<TBoard, TPlayer> extends true
        ? true
        : MatrixColEqual<TBoard, TPlayer> extends true
            ? true
            : MatrixDiagEqual<TBoard, TPlayer> extends true
                ? true
                : false;

type NextBoard<TBoard extends TicTacToeBoard, TMove extends TicTacToePositions, TChip extends TicTacToeCell> = 
    TMove extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
        ? TBoard[IndexOfY<Y>][IndexOfX<X>] extends TicTacToeEmptyCell
            ? ArrayReplace<TBoard, IndexOfY<Y>, ArrayReplace<TBoard[IndexOfY<Y>], IndexOfX<X>, TChip>>
            : TBoard
        : TBoard;

type NextState<TBoard extends TicTacToeBoard> =
    PlayerWon<TBoard, '❌'> extends true
        ? '❌ Won'
        : PlayerWon<TBoard, '⭕'> extends true
            ? '⭕ Won'
            : ArrayCount<ArrayFlatten<TBoard>, TicTacToeEmptyCell> extends 0
                ? 'Draw'
                : ArrayCount<ArrayFlatten<TBoard>, '❌'> extends ArrayCount<ArrayFlatten<TBoard>, '⭕'>
                    ? '❌'
                    : '⭕';

type NextGame<TBoard extends TicTacToeBoard> = {
    board: TBoard,
    state: NextState<TBoard>,
};

type TicTacToe<TGame extends TicTacToeGame, TMove extends TicTacToePositions> = TGame['state'] extends TicTacToeCell
    ? NextGame<NextBoard<TGame['board'], TMove, TGame['state']>>
    : TGame;
