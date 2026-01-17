package com.airline.repository;

import com.airline.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    Optional<Airport> findByCode(String code);

    java.util.List<Airport> findTop10ByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrCodeContainingIgnoreCase(
            String name, String city, String code);

    @org.springframework.data.jpa.repository.Query("SELECT a.code FROM Airport a WHERE a.code IS NOT NULL")
    java.util.List<String> findAllCodes();
}
