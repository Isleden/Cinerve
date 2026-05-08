package com.cinerve.cinerve_backend.service;

import com.cinerve.cinerve_backend.dto.MovieRequest;
import com.cinerve.cinerve_backend.model.Movie;
import com.cinerve.cinerve_backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
    }

    public Movie addMovie(MovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setRating(request.getRating());
        movie.setDuration(request.getDuration());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setDescription(request.getDescription());
        movie.setActors(request.getActors());
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, MovieRequest request) {
        Movie movie = getMovieById(id);
        movie.setTitle(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setRating(request.getRating());
        movie.setDuration(request.getDuration());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setDescription(request.getDescription());
        movie.setActors(request.getActors());
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        Movie movie = getMovieById(id);
        movieRepository.delete(movie);
    }
}