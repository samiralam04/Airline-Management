package com.airline.service;

import com.airline.entity.Airport;
import com.airline.repository.AirportRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AirportService {

    @Autowired
    AirportRepository airportRepository;

    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    public List<Airport> searchAirports(String query) {
        return airportRepository
                .findTop10ByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query,
                        query);
    }

    @PostConstruct
    public void importAirports() {
        // Check if we have a significant number of airports and a known major one (MAA)
        boolean hasData = airportRepository.count() > 10000;
        boolean hasMaa = airportRepository.findByCode("MAA").isPresent();

        if (hasData && hasMaa) {
            log.info("Airports already imported (count: {}, MAA present). Skipping.", airportRepository.count());
            return;
        }

        log.info("Airport data missing or incomplete. Starting additive import...");

        // Load existing codes to avoid duplicates
        java.util.Set<String> existingCodes = new java.util.HashSet<>(airportRepository.findAllCodes());

        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                new ClassPathResource("data/airports.csv").getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            List<Airport> airports = new ArrayList<>();
            boolean isHeader = true;

            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                String[] columns = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
                if (columns.length < 14)
                    continue;

                String type = clean(columns[2]);
                if ("closed".equalsIgnoreCase(type) || "balloonport".equalsIgnoreCase(type)) {
                    continue;
                }

                String name = clean(columns[3]);
                String isoCountry = clean(columns[8]);
                String municipality = clean(columns[10]);
                String iata = clean(columns[13]);
                String latitude = clean(columns[4]);
                String longitude = clean(columns[5]);

                if (name.isBlank() || municipality.isBlank() || isoCountry.isBlank() || iata.isBlank()) {
                    continue;
                }

                // Skip if already exists
                if (existingCodes.contains(iata)) {
                    continue;
                }

                try {
                    Airport airport = new Airport();
                    airport.setName(name);
                    airport.setCity(municipality);
                    airport.setCountry(isoCountry);
                    airport.setCode(iata);
                    airport.setLatitude(Double.parseDouble(latitude));
                    airport.setLongitude(Double.parseDouble(longitude));

                    airports.add(airport);
                    existingCodes.add(iata); // prevent duplicates within the file itself
                } catch (NumberFormatException e) {
                    log.warn("Skipping invalid coordinate data for airport: " + name);
                }

                if (airports.size() >= 1000) {
                    airportRepository.saveAll(airports);
                    airports.clear();
                }
            }

            if (!airports.isEmpty()) {
                airportRepository.saveAll(airports);
            }

            log.info("Airport data import completed successfully. Total records: {}", airportRepository.count());

        } catch (Exception e) {
            log.error("Failed to import airport data", e);
        }
    }

    private String clean(String input) {
        if (input != null && input.length() >= 2 && input.startsWith("\"") && input.endsWith("\"")) {
            return input.substring(1, input.length() - 1);
        }
        return input == null ? "" : input.trim();
    }
}
