package com.airline.service;

import com.airline.entity.Airport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WeatherService {

    @Autowired
    private RestTemplate restTemplate;

    private final String API_URL = "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true";

    public Map<String, Object> getWeather(Airport airport) {
        if (airport.getLatitude() == null || airport.getLongitude() == null) {
            return null;
        }

        try {
            return restTemplate.getForObject(
                    API_URL,
                    Map.class,
                    airport.getLatitude(),
                    airport.getLongitude());
        } catch (Exception e) {
            System.err.println("Error fetching weather for " + airport.getName() + ": " + e.getMessage());
            return null;
        }
    }
}
