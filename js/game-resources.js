/**
 * GameResources - 資源管理模組
 * 負責處理資源的收集、購買和轉換
 */

const GameResources = {
    collectLeaf(game) {
        const amount = GameConfig.actions.collect.baseAmount;
        game.state.leaf += amount;
        game.updateUI();

        const collectBtn = document.getElementById('collect-btn');
        game.showFloatingNumber(amount, '🍃', collectBtn);
        
        if (typeof Effects !== 'undefined') {
            Effects.createCollectBurst(collectBtn, '🍃');
            Effects.bumpResource('leaf');
        }
        
        if (typeof Audio !== 'undefined') {
            Audio.playCollect();
        }

        Utils.log(`收集了 ${amount} 葉子`);
    },

    getWorkerPrice(game) {
        return Math.floor(
            GameConfig.workers.basePrice * Math.pow(GameConfig.workers.priceMultiplier, game.state.workers)
        );
    },

    buyWorker(game) {
        const price = this.getWorkerPrice(game);

        if (game.state.food >= price) {
            game.state.food -= price;
            game.state.workers += 1;
            game.updateUI();

            const buyBtn = document.getElementById('buy-worker-btn');
            game.showFloatingNumber(1, '🐜', buyBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('🐜', 1, buyBtn);
                Effects.bumpResource('workers');
                Effects.bumpResource('food');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playBuy();
            }

            Utils.notify(`購買了 1 隻工蟻！`, 'success');
            Utils.log(`購買了 1 隻工蟻，價格: ${price} 食物`);
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            game.shakeButton('buy-worker-btn');
        }
    },

    bulkBuyWorkers(game) {
        const bulkAmount = GameConfig.workers.bulkBuyAmount;
        let totalCost = 0;
        const currentWorkers = game.state.workers;
        let affordableCount = 0;

        for (let i = 0; i < bulkAmount; i++) {
            const price = Math.floor(
                GameConfig.workers.basePrice * Math.pow(GameConfig.workers.priceMultiplier, currentWorkers + i)
            );
            if (game.state.food < totalCost + price) {
                break;
            }
            totalCost += price;
            affordableCount++;
        }

        if (affordableCount > 0 && game.state.food >= totalCost) {
            game.state.food -= totalCost;
            game.state.workers += affordableCount;
            game.updateUI();

            const collectBtn = document.getElementById('collect-btn');
            game.showFloatingNumber(affordableCount, '🐜', collectBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('🐜', affordableCount, collectBtn);
                Effects.bumpResource('workers');
                Effects.bumpResource('food');
            }

            Utils.notify(`批量購買了 ${affordableCount} 隻工蟻！`, 'success');
            Utils.log(`批量購買了 ${affordableCount} 隻工蟻，總價格: ${totalCost} 食物`);
        } else {
            const price = this.getWorkerPrice(game);
            Utils.notify(`食物不足！需要 ${price} 食物才能購買 1 隻工蟻`, 'error');
            game.shakeButton('collect-btn');
        }
    },

    getSoldierPrice(game) {
        return Math.floor(
            GameConfig.soldiers.basePrice * Math.pow(GameConfig.soldiers.priceMultiplier, game.state.soldiers)
        );
    },

    buySoldier(game) {
        const price = this.getSoldierPrice(game);

        if (game.state.larvae >= price) {
            game.state.larvae -= price;
            game.state.soldiers += 1;
            game.updateUI();

            const buyBtn = document.getElementById('buy-soldier-btn');
            game.showFloatingNumber(1, '⚔️', buyBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('⚔️', 1, buyBtn);
                Effects.bumpResource('soldiers');
                Effects.bumpResource('larvae');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playBuy();
            }

            Utils.notify(`孵化了 1 隻兵蟻！`, 'success');
            Utils.log(`孵化了 1 隻兵蟻，價格: ${price} 幼蟲`);
        } else {
            Utils.notify(`幼蟲不足！需要 ${price} 幼蟲`, 'error');
            game.shakeButton('buy-soldier-btn');
        }
    },

    getNursePrice(game) {
        return Math.floor(
            GameConfig.nurses.basePrice * Math.pow(GameConfig.nurses.priceMultiplier, game.state.nurses)
        );
    },

    buyNurse(game) {
        const price = this.getNursePrice(game);

        if (game.state.food >= price) {
            game.state.food -= price;
            game.state.nurses += 1;
            game.updateUI();

            const buyBtn = document.getElementById('buy-nurse-btn');
            game.showFloatingNumber(1, '👶', buyBtn);
            
            if (typeof Effects !== 'undefined') {
                Effects.createResourceParticles('👶', 1, buyBtn);
                Effects.bumpResource('nurses');
                Effects.bumpResource('food');
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playBuy();
            }

            Utils.notify(`購買了 1 隻護理蟻！`, 'success');
            Utils.log(`購買了 1 隻護理蟻，價格: ${price} 食物`);
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            game.shakeButton('buy-nurse-btn');
        }
    },

    getFoodRate(game) {
        return game.state.workers;
    },

    updateResources(game, delta) {
        const state = game.state;
        const weatherEffects = GameConfig.weather.types[state.weather].effects;
        const queenMultiplier = 1 + (state.queen * GameConfig.queen.productionMultiplier);
        const rebirthMultiplier = (typeof Rebirth !== 'undefined') ? Rebirth.permanentBonuses.productionMultiplier : 1;

        if (state.workers > 0) {
            const collectRate = GameConfig.workers.collectRate * state.workers * queenMultiplier * rebirthMultiplier * weatherEffects.leafMultiplier;
            state.leaf += collectRate * delta;

            const waterProduction = GameConfig.workers.waterProduction * state.workers * queenMultiplier * weatherEffects.waterMultiplier * delta;
            state.water += waterProduction;

            if (weatherEffects.waterMultiplier > 1.0) {
                const extraWaterGain = (collectRate * (weatherEffects.waterMultiplier - 1.0)) * delta;
                state.water += extraWaterGain;
            }
        }

        if (state.workers > 0 && state.leaf > 0) {
            const conversionRate = GameConfig.workers.conversionRate * state.workers * queenMultiplier * weatherEffects.consumptionMultiplier;
            const amount = Math.min(state.leaf, conversionRate * delta);
            state.leaf -= amount;
            state.food += amount;
            state.totalFood += amount;
        }

        if (state.queen > 0) {
            state.queenHealth = Math.max(0, state.queenHealth - (GameConfig.queen.healthDecay * delta));

            if (state.nurses > 0) {
                const healAmount = GameConfig.queen.nurseHealRate * state.nurses * delta;
                state.queenHealth = Math.min(GameConfig.queen.maxHealth, state.queenHealth + healAmount);
            }

            const healthMultiplier = state.queenHealth / GameConfig.queen.maxHealth;
            const eggProduction = GameConfig.queen.eggProductionRate * state.queen * healthMultiplier * delta;
            state.larvae += eggProduction;
        }

        if (state.nurses > 0) {
            const careBonus = GameConfig.nurses.careEfficiency * state.nurses * delta;
            state.larvae += careBonus;
        }

        if (state.rooms.fungus.level > 0) {
            const fungusProduction = state.rooms.fungus.level * GameConfig.rooms.fungus.productionRate;
            const fungusConsumption = state.rooms.fungus.level * GameConfig.rooms.fungus.waterConsumption * delta;

            const waterConsumed = Math.min(state.water, fungusConsumption);
            state.water -= waterConsumed;

            state.food += fungusProduction * delta;
            state.totalFood += fungusProduction * delta;
        }

        if (state.weather === 'storm' && weatherEffects.lossChance) {
            if (Math.random() < weatherEffects.lossChance * delta) {
                const lossPercent = weatherEffects.lossPercent || 0.1;
                const lostFood = Math.floor(state.food * lossPercent);
                const lostLeaf = Math.floor(state.leaf * lossPercent);
                const lostWater = Math.floor(state.water * lossPercent);

                state.food = Math.max(0, state.food - lostFood);
                state.leaf = Math.max(0, state.leaf - lostLeaf);
                state.water = Math.max(0, state.water - lostWater);

                Utils.notify(`🌪️ 暴風來襲！損失 ${lostFood} 食物、${lostLeaf} 葉子、${lostWater} 水滴`, 'warning');
            }
        }

        let storageCapacity = GameConfig.resources.food.baseCapacity + (state.rooms.storage.level * GameConfig.rooms.storage.capacityBonus);
        
        if (typeof Rebirth !== 'undefined') {
            storageCapacity += Rebirth.permanentBonuses.capacityBonus;
        }
        
        if (state.food > storageCapacity) {
            state.food = storageCapacity;
        }
    },
};
