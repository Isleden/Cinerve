package com.cinerve.cinerve_backend.controller;

import com.cinerve.cinerve_backend.dto.MovieRequest;
import com.cinerve.cinerve_backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/movies")
//@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // PUBLIC — any logged-in user can view movies
    @GetMapping
    public ResponseEntity<?> getAllMovies() {
        try {
            return ResponseEntity.ok(movieService.getAllMovies());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(movieService.getMovieById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ADMIN — add, update, delete
    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody MovieRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(movieService.addMovie(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Long id, @RequestBody MovieRequest request) {
        try {
            return ResponseEntity.ok(movieService.updateMovie(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        try {
            movieService.deleteMovie(id);
            return ResponseEntity.ok(Map.of("message", "Movie deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}