class Card {
  constructor(color, value) {
      this.color = color;
      this.value = value;
  }
}

const deck = [];
const hand = [];
const playArea = [];
const discardPile = [];
let monsterCount = 1;
let score = 0;
let initialMonsterHP = 30;
let monsterHP = initialMonsterHP;
let turnCount = 0;
const monsterNames = ["goblin", "デビル", "ダークナイト", "ダーククイーン"];
let currentMonsterIndex = 0;


document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("reset-game").addEventListener("click", resetGame);


function startGame() {
  createDeck();
  shuffleDeck(deck);
  drawCards(4);
  updateGameState();

  // 開始ボタンを非表示にし、リセットボタンを表示
  document.getElementById("start-game").style.display = "none";
  document.getElementById("reset-game").style.display = "block";
  document.getElementById("monster").style.backgroundImage = "url('images/goblin.png')";

}

function resetGame() {
  // ゲーム状態を初期化
  deck.length = 0;
  hand.length = 0;
  playArea.length = 0;
  discardPile.length = 0;
  monsterHP = initialMonsterHP;
  turnCount = 0;

  // ゲームを開始
  startGame();
}

function createDeck() {
  const colors = ['red', 'black', 'blue'];
  colors.forEach(color => {
      for (let i = 1; i <= 13; i++) {
          deck.push(new Card(color, i));
      }
  });
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCards(num) {
  for (let i = 0; i < num; i++) {
      if (deck.length === 0) {
          return;
      }
      hand.push(deck.pop());
  }
}

function updateHPBar() {
  const hpBar = document.getElementById("monster-hp-bar");
  const maxHP = initialMonsterHP + (currentMonsterIndex) * 15;
  const hpPercentage = (monsterHP / maxHP) * 100;
  hpBar.style.width = `${hpPercentage}%`;
}

let lastplayedbluecard = 0;


function playCard(cardIndex) {
  const card = hand[cardIndex];
  if (card.color === "red" && playArea.length > 0) {
    const lastPlayedCard = playArea[playArea.length - 1];
    if (card.value <= lastPlayedCard.value) {
      alert("赤のカードは直前に出したカードよりも大きな数字でなければなりません。");
      return;
    }
  }
  playArea.push(card);
  hand.splice(cardIndex, 1);
  applyEffect(card);
  if(card.color == 'blue' && card.value == 2){
    drawCards(0);
  } else { drawCards(1);
  }
  turnCount++; // ターン数を増やす
  updateGameState();

}

function applyEffect(card) {
  switch (card.color) {
      case 'red':
          // 赤カードの効果：モンスターにダメージを与える
          let damage = card.value;
          if (lastplayedbluecard == 5) {
              damage = Math.ceil(damage / 2);
              lastplayedbluecard = 0;
          }
          if(lastplayedbluecard == 7){
            damage = card.value + 7;
            lastplayedbluecard = 0;
          }
          monsterHP -= damage;
          lastplayedbluecard = 0;
          break;
      case 'black':
          // 黒カードの効果：山札からカードを捨て場に捨てる
          let discardCount = 14 - card.value;
          if(lastplayedbluecard == 3){
            discardCount = (14 - card.value) * 3;
            lastplayedbluecard = 0;
          }
          if (lastplayedbluecard == 11) {
            discardCount = Math.floor(discardCount / 2);
            lastplayedbluecard = 0;
          }
          if (lastplayedbluecard == 12) {
            discardCount = 0;
            lastplayedbluecard = 0;
          }
          for (let i = 0; i < discardCount; i++) {
            if (deck.length === 0) {
              break;
            }
            discardPile.push(deck.pop());
          }
          lastplayedbluecard = 0;

          break;
          
      case 'blue':
          // 青カードの効果
          handleBlueCardEffect(card);
          break;
  }

  updateGameState();


}


function handleBlueCardEffect(card) {
  switch (card.value) {
    case 1:
      const blackCards = hand.filter(c => c.color === 'black');
      if (blackCards.length > 0) {
        const randomBlackCardIndex = Math.floor(Math.random() * blackCards.length);
        const blackCard = blackCards[randomBlackCardIndex];
        playCard(hand.indexOf(blackCard));
      } else {
        alert("このカードは手札に黒がないと出せません。");
        return;
      }
      lastplayedbluecard = 1;
      break;
      case 2:
        lastplayedbluecard = 2;
          // 青カード2の効果：このターンカードを山札から引くことができない
          // drawCards(1)をコメントアウトまたは削除して、次のターンにカードを引かないようにしてください。
          break;
      case 3:
        lastplayedbluecard = 3;
          break;
      case 4:
        lastplayedbluecard = 4;
          // 青カード4の効果：相手のHPを10回復する
          monsterHP += 10;
          break;
      case 5:
        lastplayedbluecard = 5;
          // 青カード5の効果：次に出す赤のカードは効果が半分になる（繰上げ）
          nextRedCardDoubleDamage = true;
          break;
      case 6:
        lastplayedbluecard = 6;
          // 青カード6の効果：効果なし
          break;
      case 7:
        lastplayedbluecard = 7;
          // 青カード7の効果：直後に赤のカードを出す場合、攻撃力を7増加する
          break;
      // 他の青カード効果（8～13）は、同様に実装してください。
      case 8:
        lastplayedbluecard = 8;
      // 青カード8の効果：捨て場からランダムにカードを2枚山札に加えます。
      for (let i = 0; i < 2; i++) {
        if (discardPile.length === 0) {
          break;
        }
        const randomIndex = Math.floor(Math.random() * discardPile.length);
        const randomCard = discardPile.splice(randomIndex, 1)[0];
        deck.push(randomCard);
      }
      shuffleDeck(deck);
      break;
      case 9:
        lastplayedbluecard = 9;
      // 青カード9の効果：捨て場からランダムに2枚カードを引きます。
      for (let i = 0; i < 2; i++) {
        if (discardPile.length === 0) {
          break;
        }
        const randomIndex = Math.floor(Math.random() * discardPile.length);
        const randomCard = discardPile.splice(randomIndex, 1)[0];
        hand.push(randomCard);
      }
      break;
    case 10:
      lastplayedbluecard = 10;
      // 青カード10の効果：場に出ている赤と青のカードの枚数だけモンスターにダメージを与えます。
      const damage = playArea.reduce(
        (count, card) => count + (card.color === "red" || card.color === "black" ? 1 : 0),
        0
      );
      monsterHP -= damage;
      break;
    case 11:
      lastplayedbluecard = 11;
      // 青カード11の効果：次に黒のカードを出す場合、山札を捨てる枚数は半分になります。
      break;
    case 12:
      lastplayedbluecard = 12;
      // 青カード12の効果：次に黒のカードを出す場合、山札を捨てません。
      break;
    case 13:
      lastplayedbluecard = 13;
      // 青カード13の効果：捨て場にあるカードの枚数分モンスターにダメージを与えます。
      monsterHP -= discardPile.length;
      break;
  }
}



function updateGameState() {
  document.getElementById("hp-value").innerText = monsterHP;
  document.getElementById("deck-value").innerText = deck.length;
  document.getElementById("discard-value").innerText = discardPile.length;
  document.getElementById("score-value").innerText = score; // スコアの表示を追加
  updateHandDisplay();
  updatePlayAreaDisplay();
  checkVictoryOrDefeat();
  updateHPBar(); // HPバーの長さを更新

  document.getElementById("turn-value").innerText = turnCount;


    // モンスターのHPバーを更新
    const maxHP = initialMonsterHP + (currentMonsterIndex) * 15;

    const monsterHpBar = document.getElementById("monster-hp-bar");
    const hpPercentage = (monsterHP / maxHP) * 100;
    monsterHpBar.style.width = `${hpPercentage}%`;
  
    // 山札の枚数バーを更新
    const deckCountBar = document.getElementById("deck-count-bar");
    const deckPercentage = (deck.length / 39) * 100; // 最初の山札は39枚
    deckCountBar.style.width = `${deckPercentage}%`;
    


}

function updateHandDisplay() {
  const handElement = document.getElementById("hand");
  handElement.innerHTML = '';
  hand.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = `card ${card.color}`;
    cardElement.innerText = card.value;
    cardElement.addEventListener("click", () => playCard(index));
    cardElement.addEventListener("mouseover", () => showCardDescription(card));
    cardElement.addEventListener("mouseout", () => hideCardDescription());
    handElement.appendChild(cardElement);
  });
}

function updatePlayAreaDisplay() {
  const playAreaElement = document.getElementById("play-area");
  playAreaElement.innerHTML = '';
  playArea.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.className = `card ${card.color}`;
      cardElement.innerText = card.value;
      playAreaElement.appendChild(cardElement);
  });
}

function createCardElement(card, index) {
  const cardElement = document.createElement("div");
  cardElement.className = `card ${card.color}`;
  cardElement.innerText = card.value;
  cardElement.addEventListener("click", () => playCard(index));
  cardElement.addEventListener("mouseover", () => showCardDescription(card));
  cardElement.addEventListener("mouseout", () => hideCardDescription());
  return cardElement;
}

function showCardDescription(card) {
  const descriptionElement = document.getElementById("card-description");
  const description = getCardDescription(card);
  descriptionElement.innerText = description;
}

function hideCardDescription() {
  const descriptionElement = document.getElementById("card-description");
  descriptionElement.innerText = "";
}

function getCardDescription(card) {
  if (card.color === "red") {
    return `このカードはモンスターに${card.value}ダメージを与えます。直前に出したカードよりも数字が大きくないと出せない`;
  } else if (card.color === "black") {
    return `このカードは山札から${14 - card.value}枚カードを捨て場に捨てます。`;
  } else {
    switch (card.value) {
      case 1:
        return "手札に黒のカードがないと出せない。ランダムに黒のカードを場に出す。";
      case 2:
        return "このターンカードを山札から引くことができない（手札が１枚減る）";
      case 3:
        return "直後に黒のカードを出す場合、カードを捨てる枚数は３倍になる";
      case 4:
        return "相手のHPを10回復する";
      case 5:
        return "直後に出す赤のカードは効果が半分になる（繰上げ）";
      case 6: 
      return "効果なし";
      case 7:
        return "直後に赤のカードを出す場合、攻撃力を7増加する";
      case 8:
        return "捨て場からランダムにカードを2枚山札に加えます。";
      case 9:
        return "捨て場からランダムに2枚カードを引きます。";
      case 10:
        return "場に出ている赤と黒のカードの枚数だけモンスターにダメージを与えます。";
      case 11:
        return "直後に黒のカードを出す場合、山札を捨てる枚数は半分になります。";
      case 12:
        return "直後に黒のカードを出す場合、山札を捨てません。";
      case 13:
        return "捨て場にあるカードの枚数分モンスターにダメージを与えます。";
      default:
        return "";
    }
  }
}

function updateHandDisplay() {
  const handElement = document.getElementById("hand");
  handElement.innerHTML = "";
  hand.forEach((card, index) => {
    const cardElement = createCardElement(card, index);
    handElement.appendChild(cardElement);
  });
}

function showNextMonster() {
  score += deck.length * 100 * monsterCount;


  if (currentMonsterIndex >= monsterNames.length) {
    alert("ゲームクリア！おめでとうございます！");
    // ゲームをリセットまたは再開するためのオプションを提供できます。
  } else {
    currentMonsterIndex++;
    alert(`勝利！モンスターを倒しました！ 現在のスコア: ${score}`);

    deck.push(...hand, ...playArea, ...discardPile);
    hand.length = 0;
    playArea.length = 0;
    discardPile.length = 0;
    shuffleDeck(deck);
    drawCards(4);
    monsterHP = initialMonsterHP + 15 * currentMonsterIndex;
    document.getElementById("monster-name").innerText = monsterNames[currentMonsterIndex];
    document.getElementById("monster-image").style.backgroundImage = `url('images/${monsterNames[currentMonsterIndex].toLowerCase().replace(/ /g, "_")}.png')`;
    updateGameState();

  }

}


function checkVictoryOrDefeat() {
  if (monsterHP <= 0) {
    showNextMonster();
    }
    if (deck.length === 0) {
        alert("敗北…手札と山札がなくなりました。");
        // ゲームをリセットまたは再開するためのオプションを提供できます。
    }
}
