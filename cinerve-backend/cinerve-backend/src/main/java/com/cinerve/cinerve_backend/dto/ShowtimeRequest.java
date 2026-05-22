package com.cinerve.cinerve_backend.dto;

public class ShowtimeRequest {

    private Long movieId;
    private String cinema;
    private String address;
    private String distance;
    private String time;

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