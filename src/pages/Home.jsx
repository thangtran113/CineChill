import React, { useState, useEffect, useRef } from "react";
import MovieCard from "/src/components/MovieCard";
import GenreList from "/src/components/GenreList";
import { api } from "/src/services/api";
import TrailerModal from '../components/TrailerModal';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  // Các state quản lý trạng thái của ứng dụng
  const [searchQuery, setSearchQuery] = useState(""); // State cho ô tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
  const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái menu mobile
  const [activeTab, setActiveTab] = useState("all"); // Tab đang được chọn
  const [trendingMovies, setTrendingMovies] = useState([]); // Danh sách phim trending
  // const [movies, setMovies] = useState([]); // Danh sách phim phổ biến
  const [trailerKey, setTrailerKey] = useState(null); // Key của trailer đang phát
  const [selectedMovie, setSelectedMovie] = useState(null); // Phim được chọn để xem chi tiết
  const [selectedGenre, setSelectedGenre] = useState(null); // Thể loại được chọn
  const [genreMovies, setGenreMovies] = useState([]); // Danh sách phim theo thể loại
  const [showGenreList, setShowGenreList] = useState(false); // Hiển thị danh sách thể loại
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [showDropdown, setShowDropdown] = useState(false); // Hiển thị dropdown menu

  // Ref cho scroll phim
  const movieScrollerRef = useRef(null);
  const navigate = useNavigate();

  // Tự động cuộn lên đầu trang khi component được mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tự động cuộn lên đầu trang khi thay đổi tab hoặc thể loại
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, selectedGenre]);

  // Thêm useEffect để lấy phim theo thể loại khi selectedGenre thay đổi
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (!selectedGenre) {
        setGenreMovies([]);
        return;
      }

      try {
        const data = await api.getMoviesByGenre(selectedGenre);
        setGenreMovies(data.results.map(formatMovie));
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
      }
    };

    fetchMoviesByGenre();
  }, [selectedGenre]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const trendingData = await api.getTrending();
        setTrendingMovies(trendingData.results.map(formatMovie));
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  // useEffect(() => {
  //   const fetchPopularMovies = async () => {
  //     try {
  //       const popularData = await api.getPopular();
  //       setMovies(popularData.results.map(formatMovie));
  //     } catch (error) {
  //       console.error("Error fetching popular movies:", error);
  //     }
  //   };

  //   fetchPopularMovies();
  // }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await api.searchMovies(searchQuery);
        setSearchResults(results.results.map(formatMovie));
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const formatMovie = (movie) => ({
    id: movie.id,
    title: movie.title,
    poster: `${import.meta.env.VITE_IMAGE_BASE_URL}${movie.poster_path}`,
    backdrop: `${import.meta.env.VITE_IMAGE_BASE_URL}${movie.backdrop_path}`,
    overview: movie.overview,
    rating: movie.vote_average.toFixed(1),
    releaseDate: movie.release_date,
  });

  const scrollMovies = (direction) => {
    if (movieScrollerRef.current) {
      const scrollAmount = 400;
      movieScrollerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Hàm xử lý khi chọn thể loại từ GenreList component
  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId) {
      setActiveTab("genres");
    }
  };

  const handleMoreInfo = async (movieId) => {
    try {
      const movieDetails = await api.getMovieDetails(movieId);
      setSelectedMovie({
        ...movieDetails,
        backdrop: `${import.meta.env.VITE_IMAGE_BASE_URL}${
          movieDetails.backdrop_path
        }`,
        poster: `${import.meta.env.VITE_IMAGE_BASE_URL}${
          movieDetails.poster_path
        }`,
        rating: movieDetails.vote_average.toFixed(1),
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleWatchTrailer = async (movieId) => {
    try {
      const videosData = await api.getMovieVideos(movieId);
      const trailer = videosData.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        console.error("No trailer found for this movie");
      }
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };

  // Hàm này được sử dụng trong Movie Details Modal
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-screen bg-[#0a0a0a] font-[Inter] text-white overflow-x-hidden flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-[#222] shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1
                className="text-2xl font-bold text-[#e50914] cursor-pointer hover:text-[#f6121d] transition-colors duration-300 netflix-title"
                onClick={() => {
                  setActiveTab("all");
                  setShowGenreList(false);
                  setSelectedGenre(null);
                  setSearchQuery("");
                }}
              >
                CineChill
              </h1>
              <nav className="max-sm:hidden">
                <ul className="flex items-center gap-8">
                  <li>
                    <button
                      className={`text-[15px] font-medium nav-link ${
                        activeTab === "all" ? "active" : ""
                      } hover:text-[#e50914] transition-colors duration-300 netflix-text`}
                      onClick={() => {
                        setActiveTab("all");
                        setShowGenreList(false);
                        setSelectedGenre(null);
                      }}
                    >
                      All
                    </button>
                  </li>
                  {/* <li>
                    <button
                      className={`text-[15px] font-medium nav-link ${
                        activeTab === "movies" ? "active" : ""
                      } hover:text-[#e50914] transition-colors duration-300 netflix-text`}
                      onClick={() => {
                        setActiveTab("movies");
                        setShowGenreList(false);
                        setSelectedGenre(null);
                      }}
                    >
                      Movies
                    </button>
                  </li>
                  <li>
                    <button
                      className={`text-[15px] font-medium nav-link ${
                        activeTab === "series" ? "active" : ""
                      } hover:text-[#e50914] transition-colors duration-300 netflix-text`}
                      onClick={() => {
                        setActiveTab("series");
                        setShowGenreList(false);
                        setSelectedGenre(null);
                      }}
                    >
                      Series
                    </button>
                  </li> */}
                  <li>
                    <button
                      className={`text-[15px] font-medium nav-link ${
                        activeTab === "genres" ? "active" : ""
                      } hover:text-[#e50914] transition-colors duration-300 netflix-text`}
                      onClick={() => {
                        setActiveTab("genres");
                        setShowGenreList(!showGenreList);
                      }}
                    >
                      Thể loại
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-[#222] rounded-full px-4 py-2 w-[200px] max-sm:w-[150px] text-sm outline-none border border-[#333] focus:border-[#e50914] transition-colors duration-300"
                  aria-label="Search movies"
                />
              </div>
              {user ? (
                <div className="relative">
                  <button
                    className="bg-[#e50914] px-4 py-2 rounded-md text-sm font-medium max-sm:hidden hover:bg-[#f6121d] transition-colors duration-300"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {user.fullName}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#111111] ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#e50914] hover:text-white"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="bg-[#e50914] px-4 py-2 rounded-md text-sm font-medium max-sm:hidden hover:bg-[#f6121d] transition-colors duration-300"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40">
          <nav className="bg-[#111111] w-[300px] h-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#e50914]">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              <li>
                <button
                  className={`text-[15px] font-medium nav-link ${
                    activeTab === "all" ? "active" : ""
                  } hover:text-[#e50914] transition-colors duration-300 netflix-text w-full text-left py-2`}
                  onClick={() => {
                    setActiveTab("all");
                    setIsMenuOpen(false);
                    setShowGenreList(false);
                    setSelectedGenre(null);
                  }}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className={`text-[15px] font-medium nav-link ${
                    activeTab === "movies" ? "active" : ""
                  } hover:text-[#e50914] transition-colors duration-300 netflix-text w-full text-left py-2`}
                  onClick={() => {
                    setActiveTab("movies");
                    setIsMenuOpen(false);
                    setShowGenreList(false);
                    setSelectedGenre(null);
                  }}
                >
                  Movies
                </button>
              </li>
              <li>
                <button
                  className={`text-[15px] font-medium nav-link ${
                    activeTab === "series" ? "active" : ""
                  } hover:text-[#e50914] transition-colors duration-300 netflix-text w-full text-left py-2`}
                  onClick={() => {
                    setActiveTab("series");
                    setIsMenuOpen(false);
                    setShowGenreList(false);
                    setSelectedGenre(null);
                  }}
                >
                  Series
                </button>
              </li>
              <li>
                <button
                  className={`text-[15px] font-medium nav-link ${
                    activeTab === "genres" ? "active" : ""
                  } hover:text-[#e50914] transition-colors duration-300 netflix-text w-full text-left py-2`}
                  onClick={() => {
                    setActiveTab("genres");
                    setIsMenuOpen(false);
                    setShowGenreList(true);
                  }}
                >
                  Thể loại
                </button>
              </li>
              <li className="mt-4 pt-4 border-t border-[#333]">
                {user ? (
                  <div className="relative">
                    <button
                      className="bg-[#e50914] px-4 py-2 rounded-md text-sm font-medium max-sm:hidden hover:bg-[#f6121d] transition-colors duration-300"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      {user.fullName}
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#111111] ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#e50914] hover:text-white"
                            onClick={handleLogout}
                          >
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="bg-[#e50914] px-4 py-2 rounded-md text-sm font-medium max-sm:hidden hover:bg-[#f6121d] transition-colors duration-300"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}

      <main className="pt-[80px] flex-grow">
        {searchQuery.trim() !== "" && (
          <section className="max-w-[1400px] mx-auto px-6 py-12">
            <h3 className="text-2xl font-bold mb-8 netflix-title">
              {isSearching
                ? "Searching..."
                : `Search Results for "${searchQuery}"`}
            </h3>

            {!isSearching && searchResults.length === 0 && (
              <p className="text-gray-400">
                No movies found matching your search.
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={handleMoreInfo}
                />
              ))}
            </div>
          </section>
        )}

        {searchQuery.trim() === "" && (
          <>
            {showGenreList && <GenreList onGenreSelect={handleGenreSelect} />}

            {selectedGenre && genreMovies.length > 0 && (
              <section className="genre-movies max-w-[1400px] mx-auto px-6 py-12">
                <h3 className="text-2xl font-bold mb-8 netflix-title">
                  {genreMovies[0].genres?.map((g) => g.name).join(", ")}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {genreMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={handleMoreInfo} />
                  ))}
                </div>
              </section>
            )}

            {(!selectedGenre || genreMovies.length === 0) && !showGenreList && (
              <>
                <section className="relative h-[80vh] w-full">
                  {trendingMovies.length > 0 && (
                    <div className="relative h-full w-full">
                      <img
                        src={trendingMovies[0].backdrop}
                        className="w-full h-full object-cover"
                        alt={trendingMovies[0].title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 lg:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 netflix-title">
                          {trendingMovies[0].title}
                        </h1>
                        <p className="text-lg text-gray-300 mb-4 line-clamp-3 netflix-text">
                          {trendingMovies[0].overview}
                        </p>
                        <div className="flex items-center gap-4 mb-6">
                          <span className="flex items-center">
                            <svg
                              className="w-5 h-5 text-yellow-500 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{trendingMovies[0].rating}</span>
                          </span>
                          <span className="text-gray-400">
                            {new Date(
                              trendingMovies[0].releaseDate
                            ).getFullYear()}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() =>
                              handleWatchTrailer(trendingMovies[0].id)
                            }
                            className="bg-[#e50914] px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#f6121d] transition"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Watch Now
                          </button>
                          <button
                            onClick={() => handleMoreInfo(trendingMovies[0].id)}
                            className="border border-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-white hover:text-black transition"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            More Info
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="trending max-w-[1400px] mx-auto px-6 py-12">
                  <h3 className="text-2xl font-bold mb-8 netflix-title">
                    Trending Now
                  </h3>

                  <div className="relative">
                    <button
                      onClick={() => scrollMovies("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
                      aria-label="Scroll left"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div
                      ref={movieScrollerRef}
                      className="overflow-x-auto scrollbar-hide scroll-smooth"
                    >
                      <div className="flex gap-6 pb-4">
                        {trendingMovies.map((movie) => (
                          <div key={movie.id} className="flex-none w-[240px]">
                            <MovieCard movie={movie} onClick={handleMoreInfo} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => scrollMovies("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/80 transition"
                      aria-label="Scroll right"
                    >
                      <svg
                        className="w-6 h-6"
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
              </>
            )}
          </>
        )}

        {/* Movie Details Modal */}
        {selectedMovie && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMovie(null);
              }
            }}
          >
            <div className="bg-[#1a1a1a] rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="relative h-[400px]">
                <img
                  src={selectedMovie.backdrop}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h2 className="text-5xl font-bold mb-4 netflix-title">
                    {selectedMovie.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#e50914] px-3 py-1.5 rounded-md">
                      <svg
                        className="w-5 h-5 text-yellow-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-lg">{selectedMovie.rating}</span>
                    </div>
                    <span className="text-lg text-gray-300">
                      {formatRuntime(selectedMovie.runtime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 netflix-title">
                      Overview
                    </h3>
                    <p className="text-gray-300 leading-relaxed netflix-text">
                      {selectedMovie.overview}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 netflix-title">
                      Details
                    </h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-gray-500">Genres:</span>
                        <span className="text-white">
                          {selectedMovie.genres?.map((g) => g.name).join(", ")}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gray-500">Release Date:</span>
                        <span className="text-white">
                          {new Date(
                            selectedMovie.release_date
                          ).toLocaleDateString()}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => {
                      setSelectedMovie(null);
                      handleWatchTrailer(selectedMovie.id);
                    }}
                    className="bg-[#e50914] px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#f6121d] transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Now
                  </button>
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trailer Modal */}
        {trailerKey && (
          <TrailerModal trailerKey={trailerKey} onClose={() => setTrailerKey(null)} />
        )}
      </main>
    </div>
  );
}
