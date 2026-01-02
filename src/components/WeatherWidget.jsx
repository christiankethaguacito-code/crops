import React, { useState, useEffect } from 'react';
import { fetchWeather, getCurrentPosition } from '../services/api';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getWeather = async () => {
            try {
                // Try to get user's current position
                let lat = 7.0731; // Default: General Santos City
                let lon = 125.6128;

                try {
                    const coords = await getCurrentPosition();
                    lat = coords.latitude;
                    lon = coords.longitude;
                } catch (geoErr) {
                    console.log('Using default location for weather');
                }

                const data = await fetchWeather(lat, lon);
                setWeather(data);
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError('Unable to load weather');
            } finally {
                setLoading(false);
            }
        };

        getWeather();
        // Refresh weather every 30 minutes
        const interval = setInterval(getWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Weather icon mapping
    const getWeatherIcon = (condition) => {
        const icons = {
            'Clear': '☀️',
            'Sunny': '☀️',
            'Clouds': '☁️',
            'Cloudy': '☁️',
            'Partly Cloudy': '⛅',
            'Rain': '🌧️',
            'Rainy': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Humid': '💧',
            'Hot': '🌡️',
            'default': '🌤️'
        };
        return icons[condition] || icons.default;
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-white/20 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-white/20 rounded w-16"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 rounded-xl p-4 text-gray-500 text-center">
                <span className="text-2xl">🌡️</span>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{getWeatherIcon(weather?.condition)}</span>
                    <div>
                        <p className="text-sm opacity-90">{weather?.location || 'Your Location'}</p>
                        <p className="text-3xl font-bold">{weather?.temperature}°C</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">{weather?.condition}</p>
                    <p className="text-xs opacity-80">💧 {weather?.humidity}% humidity</p>
                </div>
            </div>
            
            {/* Weather Advisory */}
            {weather?.advisory && (
                <div className="mt-3 bg-white/10 rounded-lg p-2 text-xs">
                    <span className="font-semibold">🌾 Farm Advisory: </span>
                    {weather.advisory}
                </div>
            )}
            
            {/* Additional weather info */}
            <div className="mt-3 flex justify-between text-xs opacity-80">
                <span>🌅 Sunrise: {weather?.sunrise || '5:30 AM'}</span>
                <span>🌇 Sunset: {weather?.sunset || '6:15 PM'}</span>
            </div>
        </div>
    );
}
