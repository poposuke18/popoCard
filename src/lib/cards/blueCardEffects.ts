// src/lib/cards/blueCardEffects.ts を作成
export class BlueCardEffect {
    private lastBlueCardValue: number = 0;
    private modifiers = {
      redDamageMultiplier: 1,
      blackDiscardMultiplier: 1,
      skipNextDraw: false
    };
  
    setLastBlueCard(value: number) {
      this.lastBlueCardValue = value;
    }
  
    getModifiedDamage(originalDamage: number): number {
      let damage = originalDamage;
      
      // 青5: 次の赤カードのダメージ半減
      if (this.lastBlueCardValue === 5) {
        damage = Math.ceil(damage / 2);
      }
      
      // 青7: 次の赤カードに+7ダメージ
      if (this.lastBlueCardValue === 7) {
        damage += 7;
      }
      
      this.lastBlueCardValue = 0;
      return damage;
    }
  
    getModifiedDiscardAmount(originalAmount: number): number {
      let amount = originalAmount;
      
      // 青3: 次の黒カードの捨て枚数3倍
      if (this.lastBlueCardValue === 3) {
        amount *= 3;
      }
      
      // 青11: 次の黒カードの捨て枚数半減
      if (this.lastBlueCardValue === 11) {
        amount = Math.floor(amount / 2);
      }
      
      // 青12: 次の黒カードで捨てない
      if (this.lastBlueCardValue === 12) {
        amount = 0;
      }
      
      this.lastBlueCardValue = 0;
      return amount;
    }
  
    shouldSkipNextDraw(): boolean {
      return this.lastBlueCardValue === 2;
    }
  }