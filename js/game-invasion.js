/**
 * GameInvasion - 入侵系統模組
 * 負責處理入侵事件檢查和處理
 */

const GameInvasion = {
    checkInvasion(game, delta) {
        const state = game.state;
        const timeSinceLastInvasion = state.gameTime - state.lastInvasion;
        
        if (timeSinceLastInvasion < GameConfig.invasion.cooldown) {
            return;
        }

        const invasionChance = GameConfig.invasion.baseChance * delta;

        if (Math.random() < invasionChance) {
            this.handleInvasion(game);
        }
    },

    handleInvasion(game) {
        const state = game.state;
        state.lastInvasion = state.gameTime;

        const defensePower = state.soldiers * GameConfig.soldiers.defensePower;
        const invasionPower = Math.random() * 5 + 2;

        if (defensePower >= invasionPower) {
            state.defenseWins++;
            const baseReward = GameConfig.invasion.baseReward.food + Math.floor(Math.random() * 10);
            const leafReward = GameConfig.invasion.baseReward.leaf + Math.floor(Math.random() * 5);
            state.food += baseReward;
            state.leaf += leafReward;
            Utils.notify(`⚔️ 入侵已被擊退！獲得 ${baseReward} 食物 + ${leafReward} 葉子`, 'success');
            Utils.log(`防禦成功，獎勵: ${baseReward} 食物 + ${leafReward} 葉子`);
            
            game.unlockAchievement('firstDefense');
            if (state.defenseWins >= 10) {
                game.unlockAchievement('defenseMaster');
            }
        } else {
            const damage = GameConfig.invasion.baseDamage + Math.floor(Math.random() * 5);
            const lostFood = Math.min(state.food, damage);
            const lostLeaf = Math.min(state.leaf, Math.floor(damage / 2));
            state.food -= lostFood;
            state.leaf -= lostLeaf;
            Utils.notify(`⚠️ 入侵成功！損失 ${lostFood} 食物 + ${lostLeaf} 葉子`, 'error');
            Utils.log(`防禦失敗，損失: ${lostFood} 食物 + ${lostLeaf} 葉子`);
        }
    },
};
