package com.airline.controller;

import com.airline.entity.Booking;
import com.airline.entity.User;
import com.airline.repository.BookingRepository;
import com.airline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public Booking createBooking(@RequestBody Booking booking) {
        booking.setBookingTime(LocalDateTime.now());
        // In real app, handle seat booking logic / transaction here
        return bookingRepository.save(booking);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            return List.of();
        return bookingRepository.findByUser(user);
    }
}
