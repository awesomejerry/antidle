/**
 * GameRooms - 房間系統模組
 * 負責處理房間升級和蟻后餵食
 */

const GameRooms = {
    getStorageUpgradePrice(game) {
        const level = game.state.rooms.storage.level;
        return Math.floor(
            GameConfig.rooms.storage.basePrice * Math.pow(GameConfig.rooms.storage.priceMultiplier, level)
        );
    },

    upgradeStorage(game) {
        const price = this.getStorageUpgradePrice(game);
        const maxLevel = GameConfig.rooms.storage.maxLevel;

        if (game.state.food >= price && game.state.rooms.storage.level < maxLevel) {
            game.state.food -= price;
            game.state.rooms.storage.level += 1;
            game.updateUI();

            const upgradeBtn = document.getElementById('storage-upgrade-btn');
            game.showFloatingNumber(1, '🏠', upgradeBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('🏠', 1, upgradeBtn);
                Effects.upgradeSuccess(upgradeBtn.closest('.room-card'));
                Effects.bumpResource('food');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playUpgrade();
            }

            Utils.notify(`儲藏室升級到 ${game.state.rooms.storage.level} 級！`, 'success');
            Utils.log(`儲藏室升級，價格: ${price} 食物，新等級: ${game.state.rooms.storage.level}`);
        } else if (game.state.rooms.storage.level >= maxLevel) {
            Utils.notify('儲藏室已達最高等級！', 'error');
            if (typeof Audio !== 'undefined') {
                Audio.playError();
            }
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            if (typeof Audio !== 'undefined') {
                Audio.playError();
            }
            game.shakeButton('storage-upgrade-btn');
        }
    },

    getNurseryUpgradePrice(game) {
        const level = game.state.rooms.nursery.level;
        return Math.floor(
            GameConfig.rooms.nursery.basePrice * Math.pow(GameConfig.rooms.nursery.priceMultiplier, level)
        );
    },

    upgradeNursery(game) {
        const price = this.getNurseryUpgradePrice(game);
        const maxLevel = GameConfig.rooms.nursery.maxLevel;

        if (game.state.food >= price && game.state.rooms.nursery.level < maxLevel) {
            game.state.food -= price;
            game.state.rooms.nursery.level += 1;
            game.updateUI();

            const upgradeBtn = document.getElementById('nursery-upgrade-btn');
            game.showFloatingNumber(1, '🥚', upgradeBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('🥚', 1, upgradeBtn);
                Effects.upgradeSuccess(upgradeBtn.closest('.room-card'));
                Effects.bumpResource('food');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playUpgrade();
            }

            Utils.notify(`育兒室升級到 ${game.state.rooms.nursery.level} 級！`, 'success');
            Utils.log(`育兒室升級，價格: ${price} 食物，新等級: ${game.state.rooms.nursery.level}`);
        } else if (game.state.rooms.nursery.level >= maxLevel) {
            Utils.notify('育兒室已達最高等級！', 'error');
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            game.shakeButton('nursery-upgrade-btn');
        }
    },

    getFungusUpgradePrice(game) {
        const level = game.state.rooms.fungus.level;
        return Math.floor(
            GameConfig.rooms.fungus.basePrice * Math.pow(GameConfig.rooms.fungus.priceMultiplier, level)
        );
    },

    upgradeFungus(game) {
        const price = this.getFungusUpgradePrice(game);
        const maxLevel = GameConfig.rooms.fungus.maxLevel;

        if (game.state.food >= price && game.state.rooms.fungus.level < maxLevel) {
            game.state.food -= price;
            game.state.rooms.fungus.level += 1;
            game.updateUI();

            const upgradeBtn = document.getElementById('fungus-upgrade-btn');
            game.showFloatingNumber(1, '🍄', upgradeBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('🍄', 1, upgradeBtn);
                Effects.upgradeSuccess(upgradeBtn.closest('.room-card'));
                Effects.bumpResource('food');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playUpgrade();
            }

            Utils.notify(`真菌農場升級到 ${game.state.rooms.fungus.level} 級！`, 'success');
            Utils.log(`真菌農場升級，價格: ${price} 食物，新等級: ${game.state.rooms.fungus.level}`);
        } else if (game.state.rooms.fungus.level >= maxLevel) {
            Utils.notify('真菌農場已達最高等級！', 'error');
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            game.shakeButton('fungus-upgrade-btn');
        }
    },

    feedQueen(game) {
        const cost = GameConfig.queen.larvaeFeedAmount;
        const heal = GameConfig.queen.larvaeFeedHeal;

        if (game.state.queenHealth >= GameConfig.queen.maxHealth) {
            Utils.notify('蟻后健康值已滿！', 'error');
            if (typeof Audio !== 'undefined') {
                Audio.playError();
            }
            return;
        }

        if (game.state.larvae >= cost) {
            game.state.larvae -= cost;
            game.state.queenHealth = Math.min(GameConfig.queen.maxHealth, game.state.queenHealth + heal);
            game.updateUI();

            const feedBtn = document.getElementById('feed-queen-btn');
            game.showFloatingNumber(heal, '❤️', feedBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.bumpResource('larvae');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playBuy();
            }

            Utils.notify(`餵食蟻后！健康值 +${heal}`, 'success');
            Utils.log(`餵食蟻后，消耗 ${cost} 幼蟲，恢復 ${heal} 健康值`);
        } else {
            Utils.notify(`幼蟲不足！需要 ${cost} 幼蟲`, 'error');
            if (typeof Audio !== 'undefined') {
                Audio.playError();
            }
        }
    },
};
