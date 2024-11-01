'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  color: 'red' | 'black' | 'blue'
  value: number
  onClick?: () => void
  disabled?: boolean
}

const getCardDescription = (color: string, value: number) => {
  if (color === "red") {
    return `このカードはモンスターに${value}ダメージを与えます。直前に出したカードよりも数字が大きくないと出せない`;
  } else if (color === "black") {
    return `このカードは山札から${14 - value}枚カードを捨て場に捨てます。`;
  } else {
    const blueEffects = {
      1: "手札に黒のカードがないと出せない。ランダムに黒のカードを場に出す。",
      2: "このターンカードを山札から引くことができない（手札が１枚減る）",
      3: "直後に黒のカードを出す場合、カードを捨てる枚数は３倍になる",
      4: "相手のHPを10回復する",
      5: "直後に出す赤のカードは効果が半分になる（繰上げ）",
      6: "効果なし",
      7: "直後に赤のカードを出す場合、攻撃力を7増加する",
      8: "捨て場からランダムにカードを2枚山札に加えます。",
      9: "捨て場からランダムに2枚カードを引きます。",
      10: "場に出ている赤と黒のカードの枚数だけモンスターにダメージを与えます。",
      11: "直後に黒のカードを出す場合、山札を捨てる枚数は半分になります。",
      12: "直後に黒のカードを出す場合、山札を捨てません。",
      13: "捨て場にあるカードの枚数分モンスターにダメージを与えます。",
    }
    return blueEffects[value as keyof typeof blueEffects] || ""
  }
}

const getCardColor = (color: string) => {
  switch (color) {
    case 'red':
      return 'bg-red-600 hover:bg-red-700'
    case 'black':
      return 'bg-gray-800 hover:bg-gray-900'
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700'
    default:
      return 'bg-gray-600'
  }
}

export function GameCard({ color, value, onClick, disabled = false }: CardProps) {
    const [showDescription, setShowDescription] = React.useState(false)
  
    return (
        <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className="relative"
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
      <button
        className={`
          w-20 h-28 rounded-lg ${getCardColor(color)} text-white 
          font-bold shadow-lg transition-all duration-200
          flex flex-col items-center justify-center
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          border-2 border-white/10
        `}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="text-2xl mb-1">{value}</div>
        <div className="text-xs capitalize">{color}</div>
      </button>
      
      {showDescription && (
        <div className="absolute z-10 w-48 p-2 bg-black/90 text-white text-xs rounded-lg -top-20 left-1/2 transform -translate-x-1/2">
          {getCardDescription(color, value)}
        </div>
      )}
    </motion.div>
  )
}