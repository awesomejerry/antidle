/**
 * AntIdle - 日誌系統
 * 記錄和顯示遊戲中發生的事件
 */

const Journal = {
    // 日誌記錄
    entries: [],

    // 最大記錄數量
    maxEntries: 100,

    // 日誌類型
    types: {
        RESOURCE: 'resource',      // 資源相關
        PURCHASE: 'purchase',      // 購買相關
        UPGRADE: 'upgrade',        // 升級相關
        ACHIEVEMENT: 'achievement', // 成就相關
        WEATHER: 'weather',        // 天氣相關
        INVASION: 'vasion',        // 入侵相關
        REBIRTH: 'rebirth',        // 重生相關
        RESEARCH: 'research',      // 研究相關
        SYSTEM: 'system',          // 系統相關
    },

    /**
     * 初始化日誌系統
     */
    init() {
        this.loadJournal();
        Utils.log('日誌系統已啟動');
    },

    /**
     * 添加日誌記錄
     * @param {string} type - 日誌類型
     * @param {string} message - 訊息
     * @param {Object} data - 附加數據（可選）
     */
    log(type, message, data = null) {
        const entry = {
            id: Date.now(),
            type: type,
            message: message,
            data: data,
            timestamp: new Date().toISOString(),
            gameTime: Game.state.gameTime, // 遊戲時間（秒）
        };

        // 添加到開頭
        this.entries.unshift(entry);

        // 限制數量
        if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(0, this.maxEntries);
        }

        // 保存
        this.saveJournal();

        // 更新 UI
        this.updateJournalUI();

        // 觸發事件
        window.dispatchEvent(new CustomEvent('journalEntryAdded', { detail: entry }));
    },

    /**
     * 獲取日誌記錄
     * @param {Object} filters - 過濾條件（可選）
     * @returns {Array} 日誌記錄
     */
    getEntries(filters = {}) {
        let filtered = [...this.entries];

        // 按類型過濾
        if (filters.type) {
            filtered = filtered.filter(e => e.type === filters.type);
        }

        // 按數量限制
        if (filters.limit) {
            filtered = filtered.slice(0, filters.limit);
        }

        return filtered;
    },

    /**
     * 清空日誌
     */
    clear() {
        this.entries = [];
        this.saveJournal();
        this.updateJournalUI();
        Utils.notify('日誌已清空', 'info');
    },

    /**
     * 載入日誌數據
     */
    loadJournal() {
        const saved = localStorage.getItem('antidle_journal');
        if (saved) {
            try {
                this.entries = JSON.parse(saved);
            } catch (e) {
                console.error('載入日誌失敗:', e);
                this.entries = [];
            }
        }
    },

    /**
     * 保存日誌數據
     */
    saveJournal() {
        try {
            localStorage.setItem('antidle_journal', JSON.stringify(this.entries));
        } catch (e) {
            console.error('保存日誌失敗:', e);
        }
    },

    /**
     * 格式化時間戳記
     * @param {string} timestamp - ISO 時間戳記
     * @returns {string} 格式化的時間
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // 少於 1 分鐘
        if (diff < 60000) {
            return '剛剛';
        }

        // 少於 1 小時
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} 分鐘前`;
        }

        // 少於 24 小時
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} 小時前`;
        }

        // 其他
        return date.toLocaleDateString('zh-TW', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    /**
     * 格式化遊戲時間
     * @param {number} seconds - 遊戲時間（秒）
     * @returns {string} 格式化的時間
     */
    formatGameTime(seconds) {
        if (seconds < 60) {
            return `${Math.floor(seconds)}秒`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes}分`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}小時${minutes}分`;
        }
    },

    /**
     * 獲取日誌類型的圖示
     * @param {string} type - 日誌類型
     * @returns {string} 圖示
     */
    getTypeIcon(type) {
        const icons = {
            resource: '📦',
            purchase: '🛒',
            upgrade: '⬆️',
            achievement: '🏆',
            weather: '🌤️',
            invasion: '⚔️',
            rebirth: '♻️',
            research: '🔬',
            system: '⚙️',
        };
        return icons[type] || '📝';
    },

    /**
     * 獲取日誌類型的顏色
     * @param {string} type - 日誌類型
     * @returns {string} 顏色
     */
    getTypeColor(type) {
        const colors = {
            resource: '#4CAF50',
            purchase: '#FF9800',
            upgrade: '#2196F3',
            achievement: '#FFD700',
            weather: '#00BCD4',
            invasion: '#F44336',
            rebirth: '#9C27B0',
            research: '#3F51B5',
            system: '#9E9E9E',
        };
        return colors[type] || '#757575';
    },

    /**
     * 更新日誌 UI
     */
    updateJournalUI() {
        const container = document.getElementById('journal-list');
        if (!container) return;

        const entries = this.getEntries({ limit: 50 });

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">尚無日誌記錄</p>';
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="journal-entry" data-type="${entry.type}">
                <div class="entry-icon" style="color: ${this.getTypeColor(entry.type)}">
                    ${this.getTypeIcon(entry.type)}
                </div>
                <div class="entry-content">
                    <div class="entry-message">${entry.message}</div>
                    <div class="entry-meta">
                        <span class="entry-time">${this.formatTimestamp(entry.timestamp)}</span>
                        <span class="entry-game-time">遊戲時間: ${this.formatGameTime(entry.gameTime)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * 獲取統計數據
     * @returns {Object} 統計數據
     */
    getStatistics() {
        const stats = {
            total: this.entries.length,
            byType: {},
        };

        // 統計各類型數量
        for (const entry of this.entries) {
            if (!stats.byType[entry.type]) {
                stats.byType[entry.type] = 0;
            }
            stats.byType[entry.type]++;
        }

        return stats;
    },
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    Journal.init();
});
