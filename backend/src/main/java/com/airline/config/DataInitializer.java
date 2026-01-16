package com.airline.config;

import com.airline.entity.ERole;
import com.airline.entity.Role;
import com.airline.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    com.airline.repository.AirportRepository airportRepository;
    @Autowired
    com.airline.repository.AircraftRepository aircraftRepository;
    @Autowired
    com.airline.repository.FlightRepository flightRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Arrays.stream(ERole.values()).forEach(eRole -> {
                Role role = new Role();
                role.setName(eRole);
                roleRepository.save(role);
            });
        }

        if (airportRepository.count() == 0) {
            com.airline.entity.Airport del = new com.airline.entity.Airport(null, "Indira Gandhi International Airport",
                    "New Delhi", "India", 28.5562, 77.1000, "DEL");
            com.airline.entity.Airport bom = new com.airline.entity.Airport(null,
                    "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "India", 19.0896, 72.8656, "BOM");
            com.airline.entity.Airport dxb = new com.airline.entity.Airport(null, "Dubai International Airport",
                    "Dubai", "UAE", 25.2532, 55.3657, "DXB");
            com.airline.entity.Airport lhr = new com.airline.entity.Airport(null, "Heathrow Airport", "London", "UK",
                    51.4700, -0.4543, "LHR");
            airportRepository.saveAll(Arrays.asList(del, bom, dxb, lhr));

            com.airline.entity.Aircraft a320 = new com.airline.entity.Aircraft(null, "Airbus A320", 180, 150, 30);
            com.airline.entity.Aircraft b777 = new com.airline.entity.Aircraft(null, "Boeing 777", 300, 250, 50);
            aircraftRepository.saveAll(Arrays.asList(a320, b777));

            // Flights
            com.airline.entity.Flight f1 = new com.airline.entity.Flight(
                    null, "AI-101", del, bom, java.time.LocalDateTime.now().plusHours(2),
                    java.time.LocalDateTime.now().plusHours(4), a320, com.airline.entity.EFlightStatus.SCHEDULED,
                    150.0);

            com.airline.entity.Flight f2 = new com.airline.entity.Flight(
                    null, "EK-500", dxb, lhr, java.time.LocalDateTime.now().plusDays(1),
                    java.time.LocalDateTime.now().plusDays(1).plusHours(7), b777,
                    com.airline.entity.EFlightStatus.SCHEDULED, 450.0);

            com.airline.entity.Flight f3 = new com.airline.entity.Flight(
                    null, "UK-999", lhr, del, java.time.LocalDateTime.now().plusDays(2),
                    java.time.LocalDateTime.now().plusDays(2).plusHours(8), b777,
                    com.airline.entity.EFlightStatus.DELAYED, 500.0);

            flightRepository.saveAll(Arrays.asList(f1, f2, f3));
        }
    }
}
