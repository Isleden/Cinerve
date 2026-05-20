package com.cinerve.cinerve_backend.controller;

import com.cinerve.cinerve_backend.dto.BookingRequest;
import com.cinerve.cinerve_backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // GET /api/bookings/history?username=john
    @GetMapping("/history")
    public ResponseEntity<?> getUserBookings(@RequestParam String username) {
        try {
            return ResponseEntity.ok(bookingService.getUserBookings(username));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/bookings/seats?movieId=1&cinema=SM City Cebu&showtime=9:30 AM
    @GetMapping("/seats")
    public ResponseEntity<?> getReservedSeats(
            @RequestParam Long movieId,
            @RequestParam String cinema,
            @RequestParam String showtime) {
        try {
            return ResponseEntity.ok(bookingService.getReservedSeats(movieId, cinema, showtime));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}