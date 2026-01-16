package com.airline.repository;

import com.airline.entity.Airport;
import com.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT f FROM Flight f WHERE f.departureAirport.code = :origin AND f.arrivalAirport.code = :dest AND f.departureTime BETWEEN :start AND :end")
    List<Flight> findFlights(@org.springframework.data.repository.query.Param("origin") String origin,
            @org.springframework.data.repository.query.Param("dest") String dest,
            @org.springframework.data.repository.query.Param("start") LocalDateTime start,
            @org.springframework.data.repository.query.Param("end") LocalDateTime end);
}
