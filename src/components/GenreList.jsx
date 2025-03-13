import React, { useState, useEffect, useRef } from 'react';
import { api } from '/src/services/api';

// Component hiển thị danh sách thể loại phim
function GenreList({ onGenreSelect }) {
  // State quản lý danh sách và lựa chọn thể loại
  const [genres, setGenres] = useState([]); // Danh sách thể loại
  const [selectedGenre, setSelectedGenre] = useState(null); // Thể loại được chọn
  const categoryScrollerRef = useRef(null); // Ref cho scroll thể loại

  // Lấy danh sách thể loại khi component được mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await api.getGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Xử lý scroll danh sách thể loại
  const scrollCategories = (direction) => {
    if (categoryScrollerRef.current) {
      const scrollAmount = 200;
      categoryScrollerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Xử lý khi người dùng chọn thể loại
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    onGenreSelect(genreId);
  };

  // Hiển thị loading khi chưa có dữ liệu
  if (genres.length === 0) {
    return <div className="py-8 text-center">Đang tải thể loại phim...</div>;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-8">
      <h3 className="text-2xl font-bold mb-6 netflix-title">Thể loại phim</h3>
      
      <div className="relative">
        {/* Nút scroll trái */}
        <button
          onClick={() => scrollCategories("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={categoryScrollerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth py-4"
        >
          <div className="flex gap-3 pb-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 netflix-text ${
                  selectedGenre === genre.id
                    ? "bg-[#e50914] text-white font-medium shadow-lg shadow-[#e50914]/20"
                    : "bg-[#222] text-gray-300 hover:bg-[#333] hover:text-white"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollCategories("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default GenreList; 