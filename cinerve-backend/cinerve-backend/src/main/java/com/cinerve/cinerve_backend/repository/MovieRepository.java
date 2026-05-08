package com.cinerve.cinerve_backend.repository;

import com.cinerve.cinerve_backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}