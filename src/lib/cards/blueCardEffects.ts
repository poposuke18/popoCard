export class BlueCardEffects {
    private lastPlayedBlueCard: number | null = null;
    private skipNextDraw: boolean = false;

    handleBlueCardEffect(value: number) {
        this.lastPlayedBlueCard = value;
        
        if (value === 2) {
            this.skipNextDraw = true;
        }
    }

    getModifiedRedDamage(originalDamage: number): number {
        let modifiedDamage = originalDamage;

        if (this.lastPlayedBlueCard === 5) {
            modifiedDamage = Math.ceil(modifiedDamage / 2);
            this.lastPlayedBlueCard = null;
        } else if (this.lastPlayedBlueCard === 7) {
            modifiedDamage += 7;
            this.lastPlayedBlueCard = null;
        }

        return modifiedDamage;
    }

    getModifiedBlackDiscard(originalAmount: number): number {
        let modifiedAmount = originalAmount;

        if (this.lastPlayedBlueCard === 3) {
            modifiedAmount = originalAmount * 3;
            this.lastPlayedBlueCard = null;
        } else if (this.lastPlayedBlueCard === 11) {
            modifiedAmount = Math.ceil(modifiedAmount / 2);
            this.lastPlayedBlueCard = null;
        } else if (this.lastPlayedBlueCard === 12) {
            modifiedAmount = 0;
            this.lastPlayedBlueCard = null;
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
    }
}