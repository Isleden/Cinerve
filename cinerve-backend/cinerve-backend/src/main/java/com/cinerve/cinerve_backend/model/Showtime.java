package com.cinerve.cinerve_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long movieId;
    private String cinema;
    private String address;
    private String distance;
    private String time;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getCinema() { return cinema; }
    public void setCinema(String cinema) { this.cinema = cinema; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}