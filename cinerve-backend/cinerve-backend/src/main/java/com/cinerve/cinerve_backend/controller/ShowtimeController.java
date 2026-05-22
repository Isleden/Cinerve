package com.cinerve.cinerve_backend.controller;

import com.cinerve.cinerve_backend.dto.ShowtimeRequest;
import com.cinerve.cinerve_backend.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    // GET /api/showtimes?movieId=1
    @GetMapping
    public ResponseEntity<?> getShowtimes(@RequestParam Long movieId) {
        try {
            return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // POST /api/showtimes
    @PostMapping
    public ResponseEntity<?> addShowtime(@RequestBody ShowtimeRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(showtimeService.addShowtime(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE /api/showtimes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShowtime(@PathVariable Long id) {
        try {
            showtimeService.deleteShowtime(id);
            return ResponseEntity.ok(Map.of("message", "Showtime deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}