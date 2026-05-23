package com.example.cinerve.app.adapter

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.cinerve.app.R
import com.example.cinerve.app.model.Movie
import com.example.cinerve.app.moviedetail.MovieDetailActivity

class MovieAdapter(private var movies: List<Movie>) :
    RecyclerView.Adapter<MovieAdapter.MovieViewHolder>() {

    inner class MovieViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val ivPoster: ImageView = itemView.findViewById(R.id.ivMoviePoster)
        val tvTitle: TextView = itemView.findViewById(R.id.tvMovieTitle)
        val tvGenre: TextView = itemView.findViewById(R.id.tvMovieGenre)
        val tvRating: TextView = itemView.findViewById(R.id.tvMovieRating)
        val tvDuration: TextView = itemView.findViewById(R.id.tvMovieDuration)
        val btnViewDetails: Button = itemView.findViewById(R.id.btnViewDetails)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MovieViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_movie, parent, false)
        return MovieViewHolder(view)
    }

    override fun onBindViewHolder(holder: MovieViewHolder, position: Int) {
        val movie = movies[position]

        holder.tvTitle.text = movie.title
        holder.tvGenre.text = movie.genre ?: "Unknown"
        holder.tvRating.text = "${movie.rating ?: "N/A"}/10"
        holder.tvDuration.text = movie.duration ?: "N/A"

        if (!movie.posterUrl.isNullOrEmpty()) {
            Glide.with(holder.itemView.context)
                .load(movie.posterUrl)
                .placeholder(R.drawable.ic_launcher_background)
                .error(R.drawable.ic_launcher_foreground)
                .into(holder.ivPoster)
        }

        holder.btnViewDetails.setOnClickListener {
            val intent = Intent(holder.itemView.context, MovieDetailActivity::class.java)
            intent.putExtra("MOVIE", movie)
            holder.itemView.context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = movies.size

    fun updateMovies(newMovies: List<Movie>) {
        movies = newMovies
        notifyDataSetChanged()
    }
}