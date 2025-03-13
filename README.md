# WebPhim React Application

Ứng dụng xem phim được xây dựng bằng React, sử dụng TMDB API.

## 📝 Tổng Quan

Ứng dụng xem phim được xây dựng bằng React, sử dụng TMDB API. Cho phép người dùng xem thông tin phim, tìm kiếm, lọc theo thể loại và xem trailer.

## 🚀 Demo

[Link demo của ứng dụng - nếu có]

## 📁 Cấu Trúc Project

├── src/
│ ├── components/
│ │ ├── MovieCard.jsx # Component hiển thị card phim
│ │ ├── GenreList.jsx # Component danh sách thể loại
│ │ └── TrailerModal.jsx # Component modal xem trailer
│ ├── pages/
│ │ ├── Home.jsx # Trang chủ
│ │ └── MovieDetail.jsx # Trang chi tiết phim
│ ├── services/
│ │ └── api.js # Các API calls đến TMDB
│ └── styles/
│ └── components/
│ └── MovieCard.css # Styles cho MovieCard

## 🛠 Công Nghệ Sử Dụng

### Core Libraries

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "vite": "^5.0.0"
}
```

### Styling

```json
{
  "tailwindcss": "^3.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x"
}
```

### Development Tools

```json
{
  "@vitejs/plugin-react": "^4.x",
  "eslint": "^8.x",
  "prettier": "^3.x"
}
```

## 🔗 API Endpoints (TMDB)

### 1. Phim Trending

```http
GET /trending/movie/week
Params: api_key, language
```

### 2. Tìm Kiếm Phim

```http
GET /search/movie
Params: api_key, query, language
```

### 3. Chi Tiết Phim

```http
GET /movie/{movie_id}
Params: api_key, language, append_to_response
```

### 4. Videos (Trailer)

```http
GET /movie/{movie_id}/videos
Params: api_key
```

### 5. Thể Loại

```http
GET /genre/movie/list
Params: api_key, language
```

### 6. Phim Theo Thể Loại

```http
GET /discover/movie
Params: api_key, with_genres, language
```

## 🔄 Luồng Dữ Liệu và Components

### Home.jsx (Component Chính)

- Quản lý state chính của ứng dụng
- Xử lý tìm kiếm và lọc phim
- Điều phối dữ liệu giữa các components

### MovieCard.jsx

- Hiển thị thông tin cơ bản của phim
- Xử lý hiệu ứng hover
- Props: movie, onClick

### GenreList.jsx

- Hiển thị và quản lý danh sách thể loại
- Tự động lấy danh sách thể loại từ API
- Props: onGenreSelect

### MovieDetail.jsx

- Hiển thị thông tin chi tiết của phim
- Xử lý hiển thị trailer
- Sử dụng React Router params

## 📥 Cài Đặt và Chạy Project

2. **Cài đặt dependencies:**

```bash
cd WebPhim-React
npm install
```

3. **Tạo file .env:**

```env
VITE_API_KEY=your_api_key
VITE_BASE_URL=https://api.themoviedb.org/3
VITE_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

4. **Chạy project:**

```bash
npm run dev
```

## ✨ Tính Năng

- [x] Hiển thị phim trending
- [x] Tìm kiếm phim
- [x] Lọc theo thể loại
- [x] Xem chi tiết phim
- [x] Xem trailer
- [x] Giao diện responsive

## 🔍 Luồng Tương Tác

1. **Xem Danh Sách Phim:**

   - Home.jsx lấy dữ liệu từ API
   - Truyền dữ liệu xuống MovieCard.jsx
   - Hiển thị danh sách phim có thể scroll

2. **Tìm Kiếm Phim:**

   - Người dùng nhập từ khóa
   - Home.jsx gọi API tìm kiếm
   - Hiển thị kết quả

3. **Lọc Theo Thể Loại:**

   - Chọn thể loại từ GenreList
   - Home.jsx gọi API lấy phim theo thể loại
   - Cập nhật danh sách phim

4. **Xem Chi Tiết Phim:**
   - Click vào MovieCard
   - Chuyển đến trang MovieDetail
   - Hiển thị thông tin chi tiết và trailer
