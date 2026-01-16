package com.airline.service;

import com.airline.entity.ERiskLevel;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DelayPredictionService {

    public ERiskLevel predictDelayRisk(Map<String, Object> weatherData) {
        if (weatherData == null || !weatherData.containsKey("current_weather")) {
            return ERiskLevel.LOW; // Default
        }

        Map<String, Object> current = (Map<String, Object>) weatherData.get("current_weather");

        Double windSpeed = 0.0;
        if (current.get("windspeed") instanceof Number) {
            windSpeed = ((Number) current.get("windspeed")).doubleValue();
        }

        Integer weatherCode = 0;
        if (current.get("weathercode") instanceof Number) {
            weatherCode = ((Number) current.get("weathercode")).intValue();
        }

        // Rules
        // Wind > 40 -> HIGH
        // Storm (weatherCode 95, 96, 99) -> HIGH
        // Wind 25-40 -> MEDIUM
        // Rain (weatherCode 51-67, 80-82) -> MEDIUM
        // Else -> LOW

        if (windSpeed > 40) {
            return ERiskLevel.HIGH;
        }

        if (isStorm(weatherCode)) {
            return ERiskLevel.HIGH;
        }

        if (windSpeed >= 25) {
            return ERiskLevel.MEDIUM;
        }

        if (isRain(weatherCode)) {
            return ERiskLevel.MEDIUM;
        }

        return ERiskLevel.LOW;
    }

    private boolean isStorm(int code) {
        // WMO Weather interpretation codes (WW)
        // 95: Thunderstorm: Slight or moderate
        // 96, 99: Thunderstorm with slight and heavy hail
        return code == 95 || code == 96 || code == 99;
    }

    private boolean isRain(int code) {
        // 51, 53, 55: Drizzle
        // 61, 63, 65: Rain
        // 66, 67: Freezing Rain
        // 80, 81, 82: Rain showers
        return (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
    }
}
