type Letters = {
    A: [
      '█▀█ ',
      '█▀█ ',
      '▀ ▀ ',
    ],
    B: [
      '█▀▄ ',
      '█▀▄ ',
      '▀▀  '
    ],
    C: [
      '█▀▀ ',
      '█ ░░',
      '▀▀▀ '
    ],
    E: [
      '█▀▀ ',
      '█▀▀ ',
      '▀▀▀ '
    ],
    H: [
      '█ █ ',
      '█▀█ ',
      '▀ ▀ '
    ],
    I: [
      '█ ',
      '█ ',
      '▀ '
    ],
    M: [
      '█▄░▄█ ',
      '█ ▀ █ ',
      '▀ ░░▀ '
    ],
    N: [
      '█▄░█ ',
      '█ ▀█ ',
      '▀ ░▀ '
    ],
    P: [
      '█▀█ ',
      '█▀▀ ',
      '▀ ░░'
    ],
    R: [
      '█▀█ ',
      '██▀ ',
      '▀ ▀ '
    ],
    S: [
      '█▀▀ ',
      '▀▀█ ',
      '▀▀▀ '
    ],
    T: [
      '▀█▀ ',
      '░█ ░',
      '░▀ ░'
    ],
    Y: [
      '█ █ ',
      '▀█▀ ',
      '░▀ ░'
    ],
    W: [
      '█ ░░█ ',
      '█▄▀▄█ ',
      '▀ ░ ▀ '
    ],
    ' ': [
      '░',
      '░',
      '░'
    ],
    ':': [
      '#',
      '░',
      '#'
    ],
    '*': [
      '░',
      '#',
      '░'
    ],
  };
  
  type LinesPerRow = Letters['A']['length'];
  
  type Converter<TMessage extends string, TLineMessage extends string, TLine extends string, TShift extends unknown[], TResult extends string[]> = 
    Uppercase<TLineMessage> extends `${infer K extends keyof Letters}${infer Rest}`
        ? Converter<TMessage, Rest, `${TLine}${Letters[K][TShift['length']]}`, TShift, TResult>
        : TLineMessage extends `${infer K}${infer Rest}`
            ? K extends '\n'
                ? TShift['length'] extends LinesPerRow
                    ? Converter<Rest, Rest, '', [], TResult>
                    : Converter<TMessage, TMessage, '', [...TShift, 0], [...TResult, TLine]>
                : Converter<TMessage, Rest, TLine, TShift, TResult>
            : TShift['length'] extends LinesPerRow
                ? TResult
                : Converter<TMessage, TMessage, '', [...TShift, 0], [...TResult, TLine]>;
  
  type ToAsciiArt<T extends string> = Converter<T, T, '', [], []>;
