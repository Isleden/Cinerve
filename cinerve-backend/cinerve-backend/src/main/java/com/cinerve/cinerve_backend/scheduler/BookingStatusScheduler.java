package com.cinerve.cinerve_backend.scheduler;

import com.cinerve.cinerve_backend.model.Booking;
import com.cinerve.cinerve_backend.model.Movie;
import com.cinerve.cinerve_backend.repository.BookingRepository;
import com.cinerve.cinerve_backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Component
public class BookingStatusScheduler {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    // Runs every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void updateBookingStatuses() {
        List<Booking> upcomingBookings = bookingRepository
                .findAll()
                .stream()
                .filter(b -> "UPCOMING".equals(b.getStatus()))
                .toList();

        LocalDateTime now = LocalDateTime.now();

        for (Booking booking : upcomingBookings) {
            try {
                // Parse showtime e.g. "10:00 AM"
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a", Locale.US);
                LocalTime showtime = LocalTime.parse(
                    booking.getShowtime().trim().toUpperCase(), formatter);

                // Get movie duration
                int durationMinutes = 120; // default 2 hours
                Optional<Movie> movie = movieRepository.findById(booking.getMovieId());
                if (movie.isPresent() && movie.get().getDuration() != null) {
                    durationMinutes = parseDuration(movie.get().getDuration());
                }

                // Movie end time = showtime + duration
                LocalTime endTime = showtime.plusMinutes(durationMinutes);

                // Use booking creation date as movie date
                LocalDateTime movieEndDateTime = booking.getCreatedAt()
                        .toLocalDate()
                        .atTime(endTime);

                // If movie has ended, mark as COMPLETED
                if (now.isAfter(movieEndDateTime)) {
                    booking.setStatus("COMPLETED");
                    bookingRepository.save(booking);
                    System.out.println("Booking " + booking.getId() + " marked as COMPLETED");
                }
            } catch (Exception e) {
                System.out.println("Could not process booking " + booking.getId() + ": " + e.getMessage());
            }
        }
    }

    // Parse "2h 15m" → 135 minutes
    private int parseDuration(String duration) {
        int minutes = 0;
        try {
            duration = duration.toLowerCase().trim();
            if (duration.contains("h")) {
                String[] parts = duration.split("h");
                minutes += Integer.parseInt(parts[0].trim()) * 60;
                if (parts.length > 1 && parts[1].contains("m")) {
                    minutes += Integer.parseInt(parts[1].replace("m", "").trim());
                }
            } else if (duration.contains("m")) {
                minutes = Integer.parseInt(duration.replace("m", "").trim());
            }
        } catch (Exception e) {
            return 120; // default 2 hours
        }
        return minutes;
    }
}