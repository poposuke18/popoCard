// src/types/game.ts
export interface CardType {
    color: 'red' | 'black' | 'blue'
    value: number
  }
  
  export interface GameState {
    monsterHP: number
    deck: CardType[]
    hand: CardType[]
    playArea: CardType[]
    discardPile: CardType[]
    turnCount: number
    score: number
  }