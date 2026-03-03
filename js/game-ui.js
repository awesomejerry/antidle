/**
 * AntIdle - UI 更新系統
 * 處理所有 UI 更新和顯示
 */

const GameUI = {
    /**
     * 更新所有 UI
     */
    updateUI() {
        this.updateResources();
        this.updateColonyInfo();
        this.updateButtonStates();
        this.updateAchievementsUI();
        
        if (typeof ColonyView !== 'undefined') {
            ColonyView.update();
        }
        
        if (typeof Rebirth !== 'undefined') {
            Game.updateRebirthUI();
        }
        
        if (typeof Research !== 'undefined') {
            Game.updateResearchUI();
        }
    },

    /**
     * 更新資源顯示
     */
    updateResources() {
        // 更新資源數值
        document.getElementById('food').textContent = Utils.formatNumber(Game.state.food);
        document.getElementById('leaf').textContent = Utils.formatNumber(Game.state.leaf);
        document.getElementById('water').textContent = Utils.formatNumber(Game.state.water);
        document.getElementById('larvae').textContent = Utils.formatNumber(Game.state.larvae);
        document.getElementById('insect').textContent = Utils.formatNumber(Game.state.insect);
        document.getElementById('workers').textContent = Utils.formatNumber(Game.state.workers);
        document.getElementById('soldiers').textContent = Utils.formatNumber(Game.state.soldiers);
        document.getElementById('nurses').textContent = Utils.formatNumber(Game.state.nurses);
        document.getElementById('queen').textContent = Game.state.queen;

        // 更新儲存容量
        const storageCapacity = GameConfig.resources.food.baseCapacity + 
                               (Game.state.rooms.storage.level * GameConfig.rooms.storage.capacityBonus);
        document.getElementById('storage-capacity').textContent = Utils.formatNumber(storageCapacity);

        // 更新蟻后健康值
        document.getElementById('queen-health').textContent = 
            `${Game.state.queenHealth}/${GameConfig.queen.maxHealth}`;
    },

    /**
     * 更新按鈕狀態
     */
    updateButtonStates() {
        // 工蟻購買按鈕
        const workerPrice = GameShop.getWorkerPrice();
        const buyWorkerBtn = document.getElementById('buy-worker-btn');
        if (Game.state.food < workerPrice) {
            buyWorkerBtn.disabled = true;
            buyWorkerBtn.textContent = `購買工蟻 (${workerPrice} 🍯) - 食物不足`;
        } else {
            buyWorkerBtn.disabled = false;
            buyWorkerBtn.textContent = `購買工蟻 (${workerPrice} 🍯)`;
        }

        // 兵蟻購買按鈕
        const soldierPrice = GameShop.getSoldierPrice();
        const buySoldierBtn = document.getElementById('buy-soldier-btn');
        if (Game.state.larvae < soldierPrice) {
            buySoldierBtn.disabled = true;
            buySoldierBtn.textContent = `孵化兵蟻 (${soldierPrice} 🐛) - 幼蟲不足`;
        } else {
            buySoldierBtn.disabled = false;
            buySoldierBtn.textContent = `孵化兵蟻 (${soldierPrice} 🐛)`;
        }

        // 護理蟻購買按鈕
        const nursePrice = GameShop.getNursePrice();
        const buyNurseBtn = document.getElementById('buy-nurse-btn');
        if (Game.state.food < nursePrice) {
            buyNurseBtn.disabled = true;
            buyNurseBtn.textContent = `購買護理蟻 (${nursePrice} 🍯) - 食物不足`;
        } else {
            buyNurseBtn.disabled = false;
            buyNurseBtn.textContent = `購買護理蟻 (${nursePrice} 🍯)`;
        }

        // 房間升級按鈕
        const storagePrice = GameShop.getStorageUpgradePrice();
        const storageMaxLevel = GameConfig.rooms.storage.maxLevel;
        const storageUpgradeBtn = document.getElementById('storage-upgrade-btn');
        if (Game.state.food < storagePrice || Game.state.rooms.storage.level >= storageMaxLevel) {
            storageUpgradeBtn.disabled = true;
            const levelText = Game.state.rooms.storage.level >= storageMaxLevel ? '已滿級' : `${storagePrice} 🍯`;
            storageUpgradeBtn.textContent = `🏠 升級儲藏室 (${levelText})`;
        } else {
            storageUpgradeBtn.disabled = false;
            storageUpgradeBtn.textContent = `🏠 升級儲藏室 (${storagePrice} 🍯)`;
        }

        const nurseryPrice = GameShop.getNurseryUpgradePrice();
        const nurseryMaxLevel = GameConfig.rooms.nursery.maxLevel;
        const nurseryUpgradeBtn = document.getElementById('nursery-upgrade-btn');
        if (Game.state.food < nurseryPrice || Game.state.rooms.nursery.level >= nurseryMaxLevel) {
            nurseryUpgradeBtn.disabled = true;
            const levelText = Game.state.rooms.nursery.level >= nurseryMaxLevel ? '已滿級' : `${nurseryPrice} 🍯`;
            nurseryUpgradeBtn.textContent = `🥚 升級育兒室 (${levelText})`;
        } else {
            nurseryUpgradeBtn.disabled = false;
            nurseryUpgradeBtn.textContent = `🥚 升級育兒室 (${nurseryPrice} 🍯)`;
        }

        const fungusPrice = GameShop.getFungusUpgradePrice();
        const fungusMaxLevel = GameConfig.rooms.fungus.maxLevel;
        const fungusUpgradeBtn = document.getElementById('fungus-upgrade-btn');
        if (Game.state.food < fungusPrice || Game.state.rooms.fungus.level >= fungusMaxLevel) {
            fungusUpgradeBtn.disabled = true;
            const levelText = Game.state.rooms.fungus.level >= fungusMaxLevel ? '已滿級' : `${fungusPrice} 🍯`;
            fungusUpgradeBtn.textContent = `🍄 升級真菌農場 (${levelText})`;
        } else {
            fungusUpgradeBtn.disabled = false;
            fungusUpgradeBtn.textContent = `🍄 升級真菌農場 (${fungusPrice} 🍯)`;
        }
    },

    /**
     * 更新蟻群管理資訊
     */
    updateColonyInfo() {
        // 總螞蟻數量
        const totalAnts = Game.state.workers + Game.state.soldiers + 
                         Game.state.nurses + Game.state.queen;
        document.getElementById('total-ants').textContent = Utils.formatNumber(totalAnts);

        // 總防禦力
        const totalDefense = Game.state.soldiers * GameConfig.soldiers.defensePower;
        document.getElementById('total-defense').textContent = Utils.formatNumber(totalDefense);

        // 生產效率
        const productionMultiplier = 1 + (Game.state.queen * GameConfig.queen.productionMultiplier);
        document.getElementById('production-efficiency').textContent = 
            `${(productionMultiplier * 100).toFixed(0)}%`;

        // 更新房間等級顯示
        document.getElementById('storage-level').textContent = Game.state.rooms.storage.level;
        document.getElementById('nursery-level').textContent = Game.state.rooms.nursery.level;
        document.getElementById('fungus-level').textContent = Game.state.rooms.fungus.level;
    },

    /**
     * 更新成就 UI
     */
    updateAchievementsUI() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        // 獲取所有成就
        const allAchievements = Object.entries(GameConfig.achievements);
        const unlockedIds = Game.state.achievements;
        const totalAchievements = allAchievements.length;
        const unlockedCount = unlockedIds.length;

        // 更新統計
        const statsEl = document.getElementById('achievements-stats');
        if (statsEl) {
            const percentage = Math.round((unlockedCount / totalAchievements) * 100);
            statsEl.innerHTML = `
                <div class="achievements-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">已解鎖</span>
                        <span class="stat-value">${unlockedCount}/${totalAchievements}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">完成度</span>
                        <span class="stat-value">${percentage}%</span>
                    </div>
                </div>
            `;
        }

        // 清空並重建列表
        container.innerHTML = '';

        // 顯示所有成就
        allAchievements.forEach(([id, achievement]) => {
            const isUnlocked = unlockedIds.includes(id);
            const card = document.createElement('div');
            card.className = 'achievement-card';
            if (isUnlocked) {
                card.classList.add('unlocked');
            } else {
                card.classList.add('locked');
            }

            // 檢查成就進度
            let progressText = '';
            if (!isUnlocked) {
                const progress = GameAchievements.getAchievementProgress(id, achievement);
                if (progress) {
                    progressText = `<p class="achievement-progress">${progress}</p>`;
                }
            }

            card.innerHTML = `
                <span class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</span>
                <div class="achievement-info">
                    <h4>${isUnlocked ? achievement.name : '???'}</h4>
                    <p>${isUnlocked ? achievement.description : '尚未解鎖'}</p>
                    ${progressText}
                </div>
                <span class="achievement-status">${isUnlocked ? '✅' : '🔒'}</span>
            `;

            container.appendChild(card);
        });
    },

    /**
     * 過濾日誌
     * @param {string} filter - 過濾類型
     */
    filterJournal(filter) {
        if (typeof Journal === 'undefined') return;

        const container = document.getElementById('journal-list');
        if (!container) return;

        if (filter === 'all') {
            Journal.updateJournalUI();
            return;
        }

        const entries = Journal.getEntries({ type: filter, limit: 50 });

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">尚無此類型的日誌記錄</p>';
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="journal-entry" data-type="${entry.type}">
                <div class="entry-icon" style="color: ${Journal.getTypeColor(entry.type)}">
                    ${Journal.getTypeIcon(entry.type)}
                </div>
                <div class="entry-content">
                    <div class="entry-message">${entry.message}</div>
                    <div class="entry-meta">
                        <span class="entry-time">${Journal.formatTimestamp(entry.timestamp)}</span>
                        <span class="entry-game-time">遊戲時間: ${Journal.formatGameTime(entry.gameTime)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * 顯示浮動數字
     * @param {number} value - 數值
     * @param {string} elementId - 元素 ID
     */
    showFloatingNumber(value, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const floatingNum = document.createElement('div');
        floatingNum.className = 'floating-number';
        floatingNum.textContent = (value > 0 ? '+' : '') + Utils.formatNumber(value);
        floatingNum.style.left = rect.left + rect.width / 2 + 'px';
        floatingNum.style.top = rect.top + 'px';
        floatingNum.style.color = value > 0 ? '#4CAF50' : '#F44336';

        document.body.appendChild(floatingNum);

        setTimeout(() => {
            floatingNum.remove();
        }, 1000);
    },

    /**
     * 動畫資源數值
     * @param {string} elementId - 元素 ID
     */
    animateResourceValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.classList.add('resource-bump');
        setTimeout(() => {
            element.classList.remove('resource-bump');
        }, 300);
    },

    /**
     * 震動按鈕
     * @param {string} buttonId - 按鈕 ID
     */
    shakeButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.classList.add('shake');
        setTimeout(() => {
            button.classList.remove('shake');
        }, 500);
    },
};
