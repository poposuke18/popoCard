'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { GameCard } from './game-card'

interface CardType {
  color: 'red' | 'black' | 'blue'
  value: number
}

interface Monster {
  name: string
  maxHP: number
}

const MONSTERS: Monster[] = [
  { name: 'GOBLIN', maxHP: 30 },
  { name: 'DEVIL', maxHP: 45 },
  { name: 'DARK_KNIGHT', maxHP: 60 },
  { name: 'DARK_QUEEN', maxHP: 75 },
]

export function Game() {
  const [monsterHP, setMonsterHP] = useState(30)
  const [deck, setDeck] = useState<CardType[]>([])
  const [hand, setHand] = useState<CardType[]>([])
  const [playArea, setPlayArea] = useState<CardType[]>([])
  const [discardPile, setDiscardPile] = useState<CardType[]>([])
  const [score, setScore] = useState(0)
  const [turnCount, setTurnCount] = useState(0)
  const [currentMonster, setCurrentMonster] = useState(MONSTERS[0])
  const [gameStarted, setGameStarted] = useState(false)

  const createDeck = () => {
    const newDeck: CardType[] = []
    const colors: Array<'red' | 'black' | 'blue'> = ['red', 'black', 'blue']
    colors.forEach(color => {
      for (let i = 1; i <= 13; i++) {
        newDeck.push({ color, value: i })
      }
    })
    return newDeck
  }

  const shuffleDeck = (deck: CardType[]) => {
    const newDeck = [...deck]
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
  }

  const drawCards = (num: number) => {
    if (deck.length < num) {
      // ゲームオーバー処理
      return
    }
    const newHand = [...hand, ...deck.slice(0, num)]
    setHand(newHand)
    setDeck(deck.slice(num))
  }

  const startGame = () => {
    const newDeck = shuffleDeck(createDeck())
    setDeck(newDeck)
    setHand([])
    setPlayArea([])
    setDiscardPile([])
    setMonsterHP(currentMonster.maxHP)
    setTurnCount(0)
    setGameStarted(true)
    drawCards(4)
  }

  const resetGame = () => {
    setCurrentMonster(MONSTERS[0])
    setScore(0)
    startGame()
  }

  const playCard = (cardIndex: number) => {
    const card = hand[cardIndex]
    // カードの効果を適用する処理をここに実装
    // ...

    const newHand = [...hand]
    newHand.splice(cardIndex, 1)
    setHand(newHand)
    setPlayArea([...playArea, card])
    setTurnCount(turnCount + 1)
    drawCards(1)
  }


return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
        {/* Monster Area */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {currentMonster.name}
          </h2>
          {/* Monster Image */}
          <div className="relative w-full h-[300px] mb-4 flex justify-center items-center">
            <div className="relative w-[300px] h-[300px]">
              <Image
                src={`/images/${currentMonster.name}.png`}
                alt={currentMonster.name}
                fill
                style={{ objectFit: 'contain' }}
                className="transition-all duration-300"
                priority
              />
            </div>
          </div>
          {/* HP Bar */}
          <div className="relative w-full h-8 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              className="absolute h-full bg-red-600 transition-all duration-300"
              style={{ width: `${(monsterHP / currentMonster.maxHP) * 100}%` }}
            />
            <div className="absolute w-full h-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {monsterHP} / {currentMonster.maxHP}
              </span>
            </div>
          </div>
        </div>
  
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-700">
            <CardContent className="text-center text-white p-4">
              <div className="text-lg">Deck</div>
              <div className="text-2xl font-bold">{deck.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700">
            <CardContent className="text-center text-white p-4">
              <div className="text-lg">Turn</div>
              <div className="text-2xl font-bold">{turnCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-700">
            <CardContent className="text-center text-white p-4">
              <div className="text-lg">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </CardContent>
          </Card>
        </div>
  
        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={startGame}
            disabled={gameStarted}
          >
            Start Game
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={resetGame}
          >
            Reset Game
          </Button>
        </div>
  
        {/* Play Area */}
        <div className="min-h-32 mb-8 p-4 bg-gray-700 rounded-lg">
          <div className="text-white mb-2">Play Area</div>
          <div className="flex flex-wrap gap-4 justify-center">
            {playArea.map((card, index) => (
              <GameCard
                key={`play-${index}`}
                color={card.color}
                value={card.value}
                disabled={true}
              />
            ))}
          </div>
        </div>
  
        {/* Hand */}
        <div className="min-h-40 p-4 bg-gray-700 rounded-lg">
          <div className="text-white mb-2">Your Hand</div>
          <div className="flex flex-wrap gap-4 justify-center">
            {hand.map((card, index) => (
              <GameCard
                key={`hand-${index}`}
                color={card.color}
                value={card.value}
                onClick={() => playCard(index)}
                disabled={!gameStarted}
              />
            ))}
          </div>
        </div>
  
        {/* Discard Pile Count */}
        <div className="mt-4 text-center text-white">
          <span className="text-lg">Discard Pile: </span>
          <span className="font-bold">{discardPile.length}</span>
        </div>
      </div>
    </div>
  );
}