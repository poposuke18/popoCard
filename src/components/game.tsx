'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { GameCard } from './game-card'
import { motion, AnimatePresence } from 'framer-motion'
import { CardEffect, getCardEffect } from '@/lib/cards/effects'
import { animateDrawCard, wait } from '@/lib/animations/card'
import { BlueCardEffects } from '@/lib/cards/blueCardEffects'

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
    const [effectMessage, setEffectMessage] = useState<string>('')

    const [score, setScore] = useState(0)
    const [turnCount, setTurnCount] = useState(0)
    const [currentMonster, setCurrentMonster] = useState(MONSTERS[0])
    const [gameStarted, setGameStarted] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [blueEffects] = useState(() => new BlueCardEffects());


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

  const drawCards = async (num: number) => {
    if (deck.length < num) {
      handleGameOver()
      return
    }
    
    setIsDrawing(true)
    
    for (let i = 0; i < num; i++) {
      await animateDrawCard(() => {
        setHand(prev => [...prev, deck[i]])
      }, 200)
    }
    
    setDeck(prev => prev.slice(num))
    setIsDrawing(false)
  }

  const startGame = async () => {
    setGameOver(false)  // 追加

    // デッキが空の場合は新しく作成
    if (deck.length === 0) {
      const newDeck = shuffleDeck(createDeck())
      setDeck(newDeck)
    }
    
    setHand([])
    setPlayArea([])
    setDiscardPile([])
    setMonsterHP(currentMonster.maxHP)
    setTurnCount(0)
    setGameStarted(true)
    
    try {
      // ちょっと待ってから初期手札を配る（視覚的な効果のため）
      await wait(300)
      await drawCards(4)
    } catch (error) {
      console.error('Error during game start:', error)
    }
  }

  const resetGame = () => {
    setGameStarted(false)
    setCurrentMonster(MONSTERS[0])
    setScore(0)
    // 新しいデッキを用意
    const newDeck = shuffleDeck(createDeck())
    setDeck(newDeck)
  }

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", duration: 0.5 }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0, 
      transition: { duration: 0.2 }
    }
  }

  const playCard = async (cardIndex: number) => {
    const card = hand[cardIndex] as PlayedCard;
  
    // 青1のカードの場合、手札に黒カードがあるかチェック
    if (card.color === 'blue' && card.value === 1) {
      const hasBlackCard = hand.some(c => c.color === 'black');
      if (!hasBlackCard) {
        showEffectMessage('このカードは手札に黒のカードがないと出せません');
        return;
      }
    }
  
    // 赤カードの制限チェック
    if (card.color === 'red' && playArea.length > 0) {
      const lastPlayedCard = playArea[playArea.length - 1];
      if (card.value <= lastPlayedCard.value) {
        showEffectMessage('赤のカードは直前のカードより大きな数でないと出せません');
        return;
      }
    }
  
    // カードを手札から場に移動
    const newHand = [...hand];
    newHand.splice(cardIndex, 1);
    setHand(newHand);
    setPlayArea(prev => [...prev, card]);
  
    // カードの種類に応じた効果の適用
    switch (card.color) {
      case 'blue':
        blueEffects.handleBlueCardEffect(card.value);
        break;
      
      case 'red':
        const modifiedDamage = blueEffects.getModifiedRedDamage(card.value);
        setMonsterHP(prev => Math.max(0, prev - modifiedDamage));
        break;
      
      case 'black':
        const originalDiscard = 14 - card.value;
        const modifiedDiscard = blueEffects.getModifiedBlackDiscard(originalDiscard);
        
        // 捨て札の処理
        if (deck.length >= modifiedDiscard) {
          const discardedCards = deck.slice(0, modifiedDiscard);
          setDiscardPile(prev => [...prev, ...discardedCards]);
          setDeck(prev => prev.slice(modifiedDiscard));
        }
        break;
    }
  
    // 効果の実行
    const effect = getCardEffect(card.color, card.value);
    await executeEffect(effect, card); 
    // ターン終了処理
    setTurnCount(prev => prev + 1);
    
    // 青2の効果でなければカードを引く
    if (!blueEffects.shouldSkipDraw()) {  // メソッド名を修正
        await drawCards(1);
    }
  
    // モンスター撃破判定
    if (monsterHP <= 0) {
      handleMonsterDefeat();
    }
  };

  const showEffectMessage = (message: string) => {
    setEffectMessage(message)
    setTimeout(() => setEffectMessage(''), 2000) // 2秒後にメッセージを消す
  }

  const executeEffect = async (
    effect: CardEffect,
    targetCard: PlayedCard
  ) => {
      const modifiedValue = effect.type === 'damage'
          ? blueEffects.getModifiedRedDamage(effect.value)
          : effect.type === 'discard'
          ? blueEffects.getModifiedBlackDiscard(effect.value)
          : effect.value;
         
      switch (effect.type) {
          case 'damage':
              setMonsterHP(prev => Math.max(0, prev - modifiedValue));
              showEffectMessage(`${modifiedValue}のダメージ！`);
              break;
          
          case 'heal':
              setMonsterHP(prev => Math.min(currentMonster.maxHP, prev + modifiedValue))
              showEffectMessage(`${modifiedValue}回復！`)
              break;
          
          case 'discard':
              if (deck.length < modifiedValue) {
                  showEffectMessage('デッキが足りません！');
                  return;
              }
              const cardsToDiscard = deck.slice(0, modifiedValue);
              setDiscardPile(prev => [...prev, ...cardsToDiscard]);
              setDeck(prev => prev.slice(modifiedValue));
              showEffectMessage(`${modifiedValue}枚捨てました`);
              break;
          
          case 'special':
              await handleSpecialEffect(effect, targetCard);
              break;
      }
  };

interface PlayedCard extends CardType {
    color: 'red' | 'black' | 'blue'
    value: number
  }

  // 特殊効果の処理
  const handleSpecialEffect = async (
    effect: CardEffect,
    targetCard: PlayedCard
  ) => {
      blueEffects.handleBlueCardEffect(effect.value);
  
      switch (effect.value) {
        case 1:
            // 手札の黒カードをチェック
            const blackCards = hand.filter(c => c.color === 'black');
            if (blackCards.length === 0) {
              showEffectMessage('このカードは手札に黒がないと出せません');
              setHand(prev => [...prev, targetCard]);
              setPlayArea(prev => prev.slice(0, -1));
              return;
            }
          
            // ランダムに黒カードを選択
            const randomBlackCard = blackCards[Math.floor(Math.random() * blackCards.length)];
            
            // 選択された黒カードのインデックスを取得
            const blackCardIndex = hand.findIndex(c => 
              c.color === randomBlackCard.color && 
              c.value === randomBlackCard.value
            );
            
            if (blackCardIndex !== -1) {
              // メッセージを表示
              showEffectMessage(`黒の${randomBlackCard.value}を使用します`);
              
              // 手札から黒カードを削除
              setHand(prev => prev.filter((_, index) => index !== blackCardIndex));
              
              // 場に黒カードを追加
              setPlayArea(prev => [...prev, randomBlackCard]);
              
              // 黒カードの効果を適用（山札から捨てる処理）
              const discardAmount = blueEffects.getModifiedBlackDiscard(14 - randomBlackCard.value);
              
              if (deck.length >= discardAmount) {
                // 山札から指定枚数を捨て札に移動
                setDeck(prev => {
                  const newDeck = [...prev];
                  const discarded = newDeck.splice(0, discardAmount);
                  setDiscardPile(prevDiscard => [...prevDiscard, ...discarded]);
                  return newDeck;
                });
                
                showEffectMessage(`山札から${discardAmount}枚のカードを捨てました`);
              } else {
                showEffectMessage('山札が足りないため、効果を完全に適用できません');
                // 残っている山札をすべて捨てる
                setDeck(prev => {
                  const discarded = [...prev];
                  setDiscardPile(prevDiscard => [...prevDiscard, ...discarded]);
                  return [];
                });
              }
            }
            break;

      case 2:
        // このターンカードを引かない
        showEffectMessage('このターンはカードを引きません');
        break;

        case 3:
            showEffectMessage('次の黒のカードの効果が3倍になります');
            break;

      case 4:
        // モンスターのHP回復
        setMonsterHP(prev => Math.min(currentMonster.maxHP, prev + 10));
        showEffectMessage('モンスターのHPを10回復');
        break;

        case 5:
            showEffectMessage('次の赤のカードの攻撃力が半分になります');
            break;
      
          case 6:
            showEffectMessage('効果なし');
            break;
      
          case 7:
            showEffectMessage('次の赤のカードの攻撃力が7増加します');
            break;

        case 8:
            // 捨て札から2枚山札に戻す
            if (discardPile.length === 0) {
              showEffectMessage('捨て札がありません');
              return;
            }
            // cardsToReturnの型を明示
            const cardsToReturn: CardType[] = [];
            for (let i = 0; i < 2 && discardPile.length > 0; i++) {
              const randomDiscardIndex = Math.floor(Math.random() * discardPile.length);
              cardsToReturn.push(discardPile[randomDiscardIndex]);
              setDiscardPile(prev => [
                ...prev.slice(0, randomDiscardIndex),
                ...prev.slice(randomDiscardIndex + 1)
              ]);
            }
            setDeck(prev => [...prev, ...cardsToReturn]);
            showEffectMessage(`${cardsToReturn.length}枚のカードを山札に戻しました`);
            break;
          
            case 9:
                if (discardPile.length === 0) {
                  showEffectMessage('捨て札がありません');
                  return;
                }
                const cardsToHand = discardPile.slice(0, Math.min(2, discardPile.length));
                setDiscardPile(prev => prev.slice(cardsToHand.length));
                setHand(prev => [...prev, ...cardsToHand]);
                showEffectMessage(`${cardsToHand.length}枚のカードを手札に加えました`);
                break;

            case 10:
                console.log('青10効果発動：場のカード状況', {
                  allCards: playArea,
                  redBlackCards: playArea.filter(card => card.color === 'red' || card.color === 'black'),
                  currentPlayArea: playArea.map(card => `${card.color}${card.value}`).join(', ')
                });
                
                const redBlackCount = playArea.filter(card => 
                  card.color === 'red' || card.color === 'black'
                ).length - 1;
                
                console.log('計算結果：', {
                  redBlackCount,
                  damage: redBlackCount
                });
                
                if (redBlackCount > 0) {
                  setMonsterHP(prev => {
                    const newHP = Math.max(0, prev - redBlackCount);
                    console.log('HP変更：', { 前: prev, 後: newHP, 与ダメージ: redBlackCount });
                    return newHP;
                  });
                  showEffectMessage(`場の赤・黒カード${redBlackCount}枚分の${redBlackCount}ダメージを与えました！`);
                } else {
                  showEffectMessage('場に赤・黒カードがないためダメージを与えられません');
                }
                
                break;

                case 11:
                    showEffectMessage('次の黒のカードの効果が半分になります');
                    break;
              
                  case 12:
                    showEffectMessage('次の黒のカードの効果が無効になります');
                    break;

      case 13:
        // 捨て札の枚数分ダメージ
        const discardDamage = discardPile.length;
        setMonsterHP(prev => Math.max(0, prev - discardDamage));
        showEffectMessage(`${discardDamage}ダメージを与えました`);
        break;

      default:
        showEffectMessage(effect.description || '');
        break;
    }
  }; 

  useEffect(() => {
    // 初期デッキを作成
    const initialDeck = shuffleDeck(createDeck())
    setDeck(initialDeck)
  }, []) // 空の依存配列で一度だけ実行

  const handleMonsterDefeat = () => {
    // スコアを加算（例：現在のターン数が少ないほど高得点）
    const turnBonus = Math.max(100 - turnCount * 2, 0)
    const monsterBonus = currentMonster.maxHP
    setScore(prev => prev + turnBonus + monsterBonus)
  
    // 次のモンスターがいれば進む
    const currentMonsterIndex = MONSTERS.findIndex(m => m.name === currentMonster.name)
    if (currentMonsterIndex < MONSTERS.length - 1) {
      setCurrentMonster(MONSTERS[currentMonsterIndex + 1])
      setMonsterHP(MONSTERS[currentMonsterIndex + 1].maxHP)
    } else {
      // ゲームクリア処理
      alert(`ゲームクリア！\n最終スコア: ${score + turnBonus + monsterBonus}`)
      setGameStarted(false)
    }
  }

  const handleGameOver = () => {
    setGameOver(true)
    setGameStarted(false)
    alert(`ゲームオーバー\n最終スコア: ${score}\nターン数: ${turnCount}`)
  }

return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
      <AnimatePresence>
          {effectMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-10 left-1/2 transform -translate-x-1/2 
                         bg-black/80 text-white px-4 py-2 rounded-lg z-50"
            >
              {effectMessage}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Monster Area */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {currentMonster.name}
          </h2>
          {/* Monster Image */}
          <div className="relative w-full h-[300px] mb-4 flex justify-center items-center">
            <div className="relative w-[300px] h-[300px]">
            <Image
  src={`/popoCard/images/${currentMonster.name}.png`}  // プロセス環境変数を使用せずに直接パスを指定
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
          <AnimatePresence>
            {hand.map((card, index) => (
              <motion.div
                key={`hand-${index}-${card.color}-${card.value}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
          <GameCard
            color={card.color}
            value={card.value}
            onClick={() => !isDrawing && !gameOver && playCard(index)}
            disabled={!gameStarted || isDrawing || gameOver}
          />
              </motion.div>
            ))}
          </AnimatePresence>
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

