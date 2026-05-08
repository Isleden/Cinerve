package com.cinerve.cinerve_backend.dto;

public class MovieRequest {

    private String title;
    private String genre;
    private Double rating;
    private String duration;
    private String posterUrl;
    private String description;
    private String actors;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getActors() { return actors; }
    public void setActors(String actors) { this.actors = actors; }
}