/**
 * GameWeather - 天氣系統模組
 * 負責處理天氣變化和相關效果
 */

const GameWeather = {
    updateWeather(game, delta) {
        const state = game.state;

        if (state.weather !== 'clear' && state.gameTime >= state.weatherEndTime) {
            state.weather = 'clear';
            
            if (typeof Effects !== 'undefined') {
                Effects.clearWeatherEffects();
            }
            
            Utils.notify('🌤️ 天氣恢復晴朗', 'info');
            Utils.log('天氣恢復晴朗');
        }

        if (state.gameTime >= state.nextWeatherTime) {
            const weatherTypes = ['rain', 'sunny', 'storm'];
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

            state.weather = randomWeather;

            const duration = GameConfig.weather.minDuration +
                Math.random() * (GameConfig.weather.maxDuration - GameConfig.weather.minDuration);
            state.weatherEndTime = state.gameTime + duration;

            const interval = GameConfig.weather.minInterval +
                Math.random() * (GameConfig.weather.maxInterval - GameConfig.weather.minInterval);
            state.nextWeatherTime = state.gameTime + duration + interval;

            if (typeof Effects !== 'undefined') {
                Effects.createWeatherEffect(randomWeather);
            }
            
            if (typeof Audio !== 'undefined') {
                Audio.playWeather(randomWeather);
            }

            const weatherInfo = GameConfig.weather.types[randomWeather];
            Utils.notify(`${weatherInfo.icon} ${weatherInfo.name}來臨！持續 ${Math.round(duration)} 秒`, 'info');
            
            if (typeof Journal !== 'undefined') {
                Journal.log(Journal.types.WEATHER, `${weatherInfo.icon} ${weatherInfo.name}來臨，持續 ${Math.round(duration)} 秒`, {
                    weather: randomWeather,
                    duration: duration,
                });
            }
            
            Utils.log(`天氣變化: ${weatherInfo.name}, 持續 ${duration} 秒`);
        }
    },
};
