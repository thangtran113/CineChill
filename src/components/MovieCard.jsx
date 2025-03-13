import React from "react";
import '../styles/components/MovieCard.css';

// Component hiển thị thông tin phim dạng card
const MovieCard = ({ movie, onClick }) => {
  return (
    // Container chính với hiệu ứng hover
    <div
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 overflow-visible"
      onClick={() => onClick(movie.id)}
    >
      <div className="p-1">
        {/* Poster phim */}
        <img
          src={movie.poster}
          alt={movie.title}
          title={movie.title}
          className="w-full h-[360px] object-cover rounded-lg shadow-lg transition-opacity duration-300 group-hover:opacity-75"
        />
        {/* Overlay hiển thị thông tin khi hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm">{movie.title}</h3>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 mr-2 text-xs">★ {movie.rating}</span>
            <span className="text-gray-300 text-xs">{movie.releaseDate?.split('-')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;