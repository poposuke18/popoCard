// src/lib/cards/effects.ts
export type EffectType = 'damage' | 'discard' | 'heal' | 'draw' | 'special'

export interface CardEffect {
  type: EffectType
  value: number
  description: string
  conditions?: {
    previousCard?: {
      color?: 'red' | 'black' | 'blue'
      minValue?: number
      maxValue?: number
    }
    handSize?: number
  }
}

// 基本的なカード効果の定義
export const getCardEffect = (color: string, value: number): CardEffect => {
  switch (color) {
    case 'red':
      return {
        type: 'damage',
        value: value,
        description: `${value}のダメージを与える`,
      }
    case 'black':
      return {
        type: 'discard',
        value: 14 - value,
        description: `山札から${14 - value}枚捨てる`,
      }
    case 'blue':
      return getBlueCardEffect(value)
    default:
      return {
        type: 'special',
        value: 0,
        description: '効果なし',
      }
  }
}

// 青カードの効果を取得
const getBlueCardEffect = (value: number): CardEffect => {
  const effects: Record<number, CardEffect> = {
    1: {
      type: 'special',
      value: 0,
      description: '手札に黒のカードがないと出せない。ランダムに黒のカードを場に出す。',
      conditions: {
        handSize: 1
      }
    },
    4: {
      type: 'heal',
      value: 10,
      description: '相手のHPを10回復する'
    },
    // ... 他の青カードの効果も同様に定義
  }
  return effects[value] || {
    type: 'special',
    value: 0,
    description: '効果なし'
  }
}