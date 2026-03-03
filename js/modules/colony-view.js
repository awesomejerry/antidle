/**
 * AntIdle - Colony View Module
 * Renders a visual overview of colony rooms with level and key stats
 */

const ColonyView = {
    update() {
        if (typeof Game === 'undefined' || typeof GameConfig === 'undefined') return;

        this.updateStorageRoom();
        this.updateNurseryRoom();
        this.updateFungusRoom();
    },

    updateStorageRoom() {
        const level = Game.state.rooms.storage.level;
        const capacity = GameConfig.resources.food.baseCapacity + 
                        (level * GameConfig.rooms.storage.capacityBonus);

        const levelEl = document.getElementById('cv-storage-level');
        const statEl = document.getElementById('cv-storage-stat');

        if (levelEl) levelEl.textContent = level;
        if (statEl) statEl.textContent = Utils.formatNumber(capacity);
    },

    updateNurseryRoom() {
        const level = Game.state.rooms.nursery.level;
        const hatchBonus = level * GameConfig.rooms.nursery.hatchSpeedBonus;

        const levelEl = document.getElementById('cv-nursery-level');
        const statEl = document.getElementById('cv-nursery-stat');

        if (levelEl) levelEl.textContent = level;
        if (statEl) statEl.textContent = hatchBonus.toFixed(1);
    },

    updateFungusRoom() {
        const level = Game.state.rooms.fungus.level;
        const production = level * GameConfig.rooms.fungus.productionRate;

        const levelEl = document.getElementById('cv-fungus-level');
        const statEl = document.getElementById('cv-fungus-stat');

        if (levelEl) levelEl.textContent = level;
        if (statEl) statEl.textContent = production.toFixed(1);
    },
};
