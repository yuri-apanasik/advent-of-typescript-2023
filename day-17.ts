type RockPaperScissors = '👊🏻' | '🖐🏾' | '✌🏽';

type WinRules = {
    '👊🏻': '✌🏽',
    '🖐🏾': '👊🏻',
    '✌🏽': '🖐🏾',
}

type WhoWins<Opponent extends RockPaperScissors, You extends RockPaperScissors> = You extends Opponent
    ? 'draw'
    : WinRules[You] extends Opponent ? 'win' : 'lose';