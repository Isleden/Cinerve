package com.cinerve.cinerve_backend.dto;

public class BookingRequest {

    private String username;
    private Long movieId;
    private String movieTitle;
    private String cinema;
    private String showtime;
    private String seats;
    private Double totalAmount;
    private String paymentMethod;
    private String posterUrl;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getCinema() { return cinema; }
    public void setCinema(String cinema) { this.cinema = cinema; }

    public String getShowtime() { return showtime; }
    public void setShowtime(String showtime) { this.showtime = showtime; }

    public String getSeats() { return seats; }
    public void setSeats(String seats) { this.seats = seats; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
}