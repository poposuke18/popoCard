export class BlueCardEffects {
    private lastPlayedBlueCard: number | null = null;
    private skipNextDraw: boolean = false;
    private blackMultiplier: number = 1;  // 青3用
    private redDamageModifier: 'half' | 'plus7' | null = null;  // 青5, 青7用
    private blackEffectModifier: 'half' | 'nullify' | null = null;  // 青11, 青12用

    handleBlueCardEffect(value: number) {
        this.lastPlayedBlueCard = value;
        
        switch (value) {
            case 2:
                this.skipNextDraw = true;
                break;
            case 3:
                this.blackMultiplier = 3;
                break;
            case 5:
                this.redDamageModifier = 'half';
                break;
            case 7:
                this.redDamageModifier = 'plus7';
                break;
            case 11:
                this.blackEffectModifier = 'half';
                break;
            case 12:
                this.blackEffectModifier = 'nullify';
                break;
        }
    }

    getModifiedRedDamage(originalDamage: number): number {
        let modifiedDamage = originalDamage;

        if (this.redDamageModifier === 'half') {
            modifiedDamage = Math.ceil(modifiedDamage / 2);
            this.redDamageModifier = null;  // 効果をリセット
        } else if (this.redDamageModifier === 'plus7') {
            modifiedDamage += 7;
            this.redDamageModifier = null;  // 効果をリセット
        }

        return modifiedDamage;
    }

    getModifiedBlackDiscard(originalAmount: number): number {
        let modifiedAmount = originalAmount;

        // 青3の効果を適用（3倍）
        if (this.blackMultiplier === 3) {
            modifiedAmount *= 3;
            this.blackMultiplier = 1;  // リセット
        }

        // 青11の効果を適用（半減）
        if (this.blackEffectModifier === 'half') {
            modifiedAmount = Math.ceil(modifiedAmount / 2);
            this.blackEffectModifier = null;
        }
        // 青12の効果を適用（無効化）
        else if (this.blackEffectModifier === 'nullify') {
            modifiedAmount = 0;
            this.blackEffectModifier = null;
        }

        return modifiedAmount;
    }

    shouldSkipDraw(): boolean {
        if (this.skipNextDraw) {
            this.skipNextDraw = false;
            return true;
        }
        return false;
    }

    reset() {
        this.lastPlayedBlueCard = null;
        this.skipNextDraw = false;
        this.blackMultiplier = 1;
        this.redDamageModifier = null;
        this.blackEffectModifier = null;
    }

    // デバッグ用のメソッド
    getCurrentState() {
        return {
            lastPlayedBlueCard: this.lastPlayedBlueCard,
            skipNextDraw: this.skipNextDraw,
            blackMultiplier: this.blackMultiplier,
            redDamageModifier: this.redDamageModifier,
            blackEffectModifier: this.blackEffectModifier
        };
    }
}