import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/pages/MovieDetail.css';

// Component hiển thị chi tiết phim
function MovieDetail() {
  const { id } = useParams(); // Lấy ID phim từ URL
  const [movie, setMovie] = useState(null); // State lưu thông tin chi tiết phim

  // Lấy thông tin chi tiết phim khi component được mount hoặc ID thay đổi
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const details = await api.getMovieDetails(id);
        // Định dạng dữ liệu phim
        setMovie({
          id: details.id,
          title: details.title,
          backdrop: `${import.meta.env.VITE_IMAGE_BASE_URL}${details.backdrop_path}`,
          overview: details.overview || "Chưa có thông tin",
          rating: details.vote_average.toFixed(1),
          runtime: details.runtime,
          genres: details.genres,
          director: details.director
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();
  }, [id]);

  // Hàm format thời lượng phim từ phút sang giờ:phút
  const formatRuntime = (minutes) => {
    if (!minutes) return "Chưa có thông tin";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (!movie) return <div>Loading...</div>;

  return (
    <div className="pt-[80px]">
      <div className="relative h-[400px]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#e50914] px-3 py-1.5 rounded-md">
              <span className="text-lg">{movie.rating}</span>
            </div>
            <span className="text-lg text-gray-300">{formatRuntime(movie.runtime)}</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Overview</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Details</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-gray-500">Genres:</span>
                <span className="text-white">
                  {movie.genres?.map(g => g.name).join(', ')}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">Director:</span>
                <span className="text-white">{movie.director}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;