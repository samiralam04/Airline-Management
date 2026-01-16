package com.airline.service;

import com.airline.entity.Airport;
import com.airline.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
}
