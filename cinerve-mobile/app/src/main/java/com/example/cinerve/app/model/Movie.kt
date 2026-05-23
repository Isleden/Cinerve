package com.example.cinerve.app.model

import java.io.Serializable

data class Movie(
    val id: Long,
    val title: String,
    val genre: String?,
    val rating: Double?,
    val duration: String?,
    val posterUrl: String?,
    val description: String?,
    val actors: String?
) : Serializable