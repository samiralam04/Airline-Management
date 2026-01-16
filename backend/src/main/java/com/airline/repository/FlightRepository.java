package com.airline.repository;

import com.airline.entity.Airport;
import com.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByDepartureAirportAndArrivalAirportAndDepartureTimeBetween(
            Airport departureAirport, Airport arrivalAirport, LocalDateTime start, LocalDateTime end);
}
