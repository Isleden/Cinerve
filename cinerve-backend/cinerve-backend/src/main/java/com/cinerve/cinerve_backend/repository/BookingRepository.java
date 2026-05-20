package com.cinerve.cinerve_backend.repository;

import com.cinerve.cinerve_backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUsernameOrderByCreatedAtDesc(String username);

    List<Booking> findByCinemaAndShowtimeAndMovieId(String cinema, String showtime, Long movieId);
}