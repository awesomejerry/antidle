/**
 * AntIdle - 工具函數庫
 * 提供各種輔助函數
 */

const Utils = {
    /**
     * 格式化數字，加入千分位分隔符
     * @param {number} num - 要格式化的數字
     * @param {number} decimals - 小數點位數
     * @returns {string} 格式化後的字串
     */
    formatNumber(num, decimals = 0) {
        if (num === undefined || num === null) return '0';
        return Number(num).toLocaleString('zh-TW', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    },

    /**
     * 格式化時間（秒轉為 HH:MM:SS）
     * @param {number} seconds - 總秒數
     * @returns {string} 格式化後的時間字串
     */
    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    },

    /**
     * 顯示通知
     * @param {string} message - 通知訊息
     * @param {string} type - 通知類型 (success, warning, error)
     */
    notify(message, type = 'info') {
        if (!GameConfig.notifications.enabled) return;

        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // 檢查通知數量
        const notifications = container.querySelectorAll('.notification');
        if (notifications.length > GameConfig.notifications.maxCount) {
            notifications[0].remove();
        }

        // 自動移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, GameConfig.notifications.duration);
    },

    /**
     * 隨機數（包含 min 和 max）
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 隨機數
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 限制數字範圍
     * @param {number} value - 數值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 限制後的數值
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * 深度複製物件
     * @param {object} obj - 要複製的物件
     * @returns {object} 複製後的物件
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 防抖函數
     * @param {function} func - 要執行的函數
     * @param {number} wait - 等待時間（毫秒）
     * @returns {function} 防抖後的函數
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 節流函數
     * @param {function} func - 要執行的函數
     * @param {number} limit - 時間限制（毫秒）
     * @returns {function} 節流後的函數
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 延遲執行
     * @param {number} ms - 延遲時間（毫秒）
     * @returns {Promise} Promise 物件
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 調試日誌
     * @param {...any} args - 要輸出的內容
     */
    log(...args) {
        if (GameConfig.debug) {
            console.log(`[AntIdle Debug]`, ...args);
        }
    },
};
