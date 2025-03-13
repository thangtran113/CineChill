const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = {
  // Lấy danh sách phim đang thịnh hành
  getTrending: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=vi-VN`
    );
    return await response.json();
  },

  // Lấy danh sách phim phổ biến
  getPopular: async () => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi-VN`
    );
    return await response.json();
  },

  // API tìm kiếm phim
  searchMovies: async (query) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=vi-VN`
    );
    return await response.json();
  },

  // Lấy thông tin chi tiết của một phim
  getMovieDetails: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits`
    );
    const data = await response.json();

    // Tìm thông tin đạo diễn từ credits
    const director =
      data.credits.crew.find((person) => person.job === "Director")?.name ||
      "Chưa có thông tin";

    return {
      id: data.id,
      title: data.title,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      vote_average: data.vote_average,
      release_date: data.release_date,
      runtime: data.runtime,
      genres: data.genres,
      director: director,
    };
  },

  // Lấy danh sách video (trailer) của phim
  getMovieVideos: async (movieId) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    return await response.json();
  },

  // Lấy danh sách thể loại phim
  getGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=vi-VN`
    );
    return await response.json();
  },

  // Lấy danh sách phim theo thể loại
  getMoviesByGenre: async (genreId) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=vi-VN`
    );
    return await response.json();
  }
};
