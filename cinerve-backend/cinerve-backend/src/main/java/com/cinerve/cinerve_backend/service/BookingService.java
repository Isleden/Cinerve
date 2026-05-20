package com.cinerve.cinerve_backend.service;

import com.cinerve.cinerve_backend.dto.BookingRequest;
import com.cinerve.cinerve_backend.model.Booking;
import com.cinerve.cinerve_backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getUserBookings(String username) {
        return bookingRepository.findByUsernameOrderByCreatedAtDesc(username);
    }

    public List<String> getReservedSeats(Long movieId, String cinema, String showtime) {
        List<Booking> bookings = bookingRepository
                .findByCinemaAndShowtimeAndMovieId(cinema, showtime, movieId);

        return bookings.stream()
                .flatMap(b -> Arrays.stream(b.getSeats().split(",")))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    public Booking createBooking(BookingRequest request) {
        // Check for seat conflicts
        List<String> reservedSeats = getReservedSeats(
                request.getMovieId(),
                request.getCinema(),
                request.getShowtime()
        );

        List<String> requestedSeats = Arrays.asList(request.getSeats().split(","));
        for (String seat : requestedSeats) {
            if (reservedSeats.contains(seat.trim())) {
                throw new RuntimeException("Seat " + seat.trim() + " is already reserved.");
            }
        }

        Booking booking = new Booking();
        booking.setUsername(request.getUsername());
        booking.setMovieId(request.getMovieId());
        booking.setMovieTitle(request.getMovieTitle());
        booking.setCinema(request.getCinema());
        booking.setShowtime(request.getShowtime());
        booking.setSeats(request.getSeats());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setPosterUrl(request.getPosterUrl());
        booking.setBookingReference(generateReference());
        booking.setStatus("UPCOMING");

        return bookingRepository.save(booking);
    }

    private String generateReference() {
        return UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }
}