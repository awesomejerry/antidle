# AntIdle - 開發指南

## 快速開始開發

### 測試遊戲

1. 直接用瀏覽器開啟 `index.html`
2. 或使用本地伺服器：
```bash
python -m http.server 8000
# 瀏覽器訪問: http://localhost:8000
```

### 調試技巧

#### 1. 啟用調試日誌

在 `js/config.js` 中設定：
```javascript
debug: true,
```

打開瀏覽器開發者工具 (F12) 的 Console 頁籤，即可看到詳細日誌。

#### 2. 修改遊戲參數

在 `js/config.js` 中調整遊戲平衡性：

```javascript
// 增加每次收集的食物量
actions: {
    collect: {
        baseAmount: 10, // 改為 10
    },
},

// 加快遊戲循環
game: {
    tickRate: 500, // 改為 500ms
},
```

#### 3. 重置遊戲

方法 1：在遊戲中點擊「設定」→「重置遊戲」

方法 2：清除瀏覽器 LocalStorage：
```javascript
// 在 Console 中執行
localStorage.removeItem('antidle_save');
location.reload();
```

### 檔案說明

#### `index.html`
- 遊戲的主 HTML 檔案
- 定義頁面結構和 UI 元素
- 載入 CSS 和 JavaScript

#### `css/variables.css`
- CSS 變數定義
- 集中管理顏色、間距、字型等
- 支援深色模式（自動切換）

#### `css/style.css`
- 主要樣式表
- 響應式設計
- 動畫效果

#### `js/config.js`
- 遊戲配置檔案
- 所有可調整的參數
- 方便平衡性調整

#### `js/utils.js`
- 工具函數庫
- 通用功能（格式化、通知等）
- 可重複使用

#### `js/game.js`
- 遊戲核心邏輯
- 狀態管理
- 更新循環和儲存系統

### 擴展功能範例

#### 新增資源

1. 在 `config.js` 中定義資源：
```javascript
resources: {
    wood: {
        name: '木材',
        icon: '🪵',
        initial: 0,
        precision: 0,
    },
},
```

2. 在 `game.js` 中初始化：
```javascript
state: {
    food: 0,
    workers: 0,
    wood: 0,  // 新增
    // ...
},
```

3. 在 HTML 中新增顯示元素：
```html
<div class="resource">
    <span class="resource-icon">🪵</span>
    <span class="resource-label">木材</span>
    <span class="resource-value" id="wood">0</span>
</div>
```

4. 在 `updateUI()` 中更新：
```javascript
document.getElementById('wood').textContent = Utils.formatNumber(
    this.state.wood,
    GameConfig.resources.wood.precision
);
```

#### 新增動作

1. 在 `config.js` 中定義：
```javascript
actions: {
    collect: { /* ... */ },
    hireWorker: {
        baseCost: 10,
        costMultiplier: 1.5,
    },
},
```

2. 在 HTML 中新增按鈕：
```html
<button id="hire-worker-btn" class="action-btn">🐜 招募工蟻 (10 食物)</button>
```

3. 在 `game.js` 中實作：
```javascript
hireWorker() {
    const cost = GameConfig.actions.hireWorker.baseCost;
    if (this.state.food >= cost) {
        this.state.food -= cost;
        this.state.workers += 1;
        // 增加下次成本
        GameConfig.actions.hireWorker.baseCost *= GameConfig.actions.hireWorker.costMultiplier;
        this.updateUI();
        Utils.notify('成功招募一只工蟻！', 'success');
    } else {
        Utils.notify('食物不足！', 'warning');
    }
},
```

4. 綁定事件：
```javascript
document.getElementById('hire-worker-btn').addEventListener('click', () => {
    Game.hireWorker();
});
```

### 最佳實踐

#### 1. 保持模組化
- 配置放在 `config.js`
- 工具函數放在 `utils.js`
- 遊戲邏輯放在 `game.js`

#### 2. 使用 CSS 變數
- 不要硬編碼顏色
- 統一使用 `variables.css` 中的變數

#### 3. 統一使用工具函數
- 數字格式化：`Utils.formatNumber()`
- 時間格式化：`Utils.formatTime()`
- 顯示通知：`Utils.notify()`

#### 4. 適當使用調試日誌
```javascript
Utils.log('重要事件發生', someData);
```

#### 5. 更新 README.md
- 新增功能時更新說明
- 紀錄重大變更

### 常見問題

**Q: 遊戲數值太大，顯示很亂？**
A: 使用 `Utils.formatNumber()` 格式化數字，加入千分位分隔符。

**Q: 動畫效果卡頓？**
A: 檢查是否在循環中頻繁操作 DOM，改用 `requestAnimationFrame`。

**Q: 存檔檔案太大？**
A: 只儲存必要資料，避免儲存計算得出的數值。

**Q: 遊戲離線時間計算不準？**
A: 在 `loadGame()` 中計算離線時間並補償資源。

### 下一步計畫

- [ ] 實作工蟻招募系統
- [ ] 新增多種資源類型
- [ ] 實作升級商店
- [ ] 新增成就系統
- [ ] 新增音效和背景音樂
- [ ] 多語言支援
- [ ] 深色模式開關

---

**祝你開發愉快！🎮**
