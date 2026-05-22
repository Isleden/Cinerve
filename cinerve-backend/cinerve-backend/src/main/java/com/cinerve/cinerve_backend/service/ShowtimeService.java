package com.cinerve.cinerve_backend.service;

import com.cinerve.cinerve_backend.dto.ShowtimeRequest;
import com.cinerve.cinerve_backend.model.Showtime;
import com.cinerve.cinerve_backend.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public Showtime addShowtime(ShowtimeRequest request) {
        Showtime showtime = new Showtime();
        showtime.setMovieId(request.getMovieId());
        showtime.setCinema(request.getCinema());
        showtime.setAddress(request.getAddress());
        showtime.setDistance(request.getDistance());
        showtime.setTime(request.getTime());
        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(Long id) {
        showtimeRepository.deleteById(id);
    }

    @Transactional
    public void deleteShowtimesByMovie(Long movieId) {
        showtimeRepository.deleteByMovieId(movieId);
    }
}