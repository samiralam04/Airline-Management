package com.airline.controller;

import com.airline.entity.Flight;
import com.airline.repository.FlightRepository;
import com.airline.service.DelayPredictionService;
import com.airline.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    FlightRepository flightRepository;

    @Autowired
    WeatherService weatherService;

    @Autowired
    DelayPredictionService delayPredictionService;

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @GetMapping("/search")
    public List<Flight> searchFlights(@RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String date) {
        // Parse date (yyyy-MM-dd)
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        java.time.LocalDateTime start = localDate.atStartOfDay();
        java.time.LocalDateTime end = localDate.atTime(java.time.LocalTime.MAX);

        return flightRepository.findFlights(origin, destination, start, end);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return flightRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Flight createFlight(@RequestBody Flight flight) {
        return flightRepository.save(flight);
    }

    @GetMapping("/{id}/weather")
    public ResponseEntity<?> getFlightWeather(@PathVariable Long id) {
        Flight flight = flightRepository.findById(id).orElse(null);
        if (flight == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> departureWeather = weatherService.getWeather(flight.getDepartureAirport());
        Map<String, Object> arrivalWeather = weatherService.getWeather(flight.getArrivalAirport());

        return ResponseEntity.ok(Map.of(
                "departure", departureWeather != null ? departureWeather : "Unavailable",
                "arrival", arrivalWeather != null ? arrivalWeather : "Unavailable"));
    }

    @GetMapping("/{id}/delay-risk")
    public ResponseEntity<?> getDelayRisk(@PathVariable Long id) {
        Flight flight = flightRepository.findById(id).orElse(null);
        if (flight == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> departureWeather = weatherService.getWeather(flight.getDepartureAirport());
        // Simple risk based on departure weather only for now
        return ResponseEntity.ok(Map.of(
                "riskLevel", delayPredictionService.predictDelayRisk(departureWeather)));
    }
}
