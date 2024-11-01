// src/lib/cards/modifiers.ts
export interface EffectModifier {
    type: 'multiply' | 'divide' | 'add' | 'subtract'
    value: number
    duration: number
    effectType: 'damage' | 'discard' | 'heal' | 'all'
  }
  
  export class ModifierManager {
    private modifiers: EffectModifier[] = []
  
    addModifier(modifier: EffectModifier) {
      this.modifiers.push(modifier)
    }
  
    updateModifiers() {
      // ターン終了時に持続時間を減らす
      this.modifiers = this.modifiers
        .map(mod => ({ ...mod, duration: mod.duration - 1 }))
        .filter(mod => mod.duration > 0)
    }
  
    applyModifiers(value: number, effectType: string): number {
      let result = value
      
      this.modifiers
        .filter(mod => mod.effectType === effectType || mod.effectType === 'all')
        .forEach(mod => {
          switch (mod.type) {
            case 'multiply':
              result *= mod.value
              break
            case 'divide':
              result = Math.ceil(result / mod.value)
              break
            case 'add':
              result += mod.value
              break
            case 'subtract':
              result -= mod.value
              break
          }
        })
      
      return Math.max(0, Math.round(result))
    }
  }