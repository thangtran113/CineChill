import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// Kết nối tới MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'thangtran1801', // Thay đổi thành mật khẩu MySQL của bạn
  database: 'cinechill',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API đăng ký
app.post('/register', (req, res) => {
  console.log('Received registration request:', req.body);
  const { fullName, email, password } = req.body;
  
  // Kiểm tra các trường không được để trống
  if (!fullName || !email || !password) {
    console.log('Missing required fields');
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }
  
  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }
  
  // Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }
  
  // Kiểm tra email đã tồn tại chưa
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    
    console.log('Email check results:', results);
    
    if (results.length > 0) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    
    // Mã hóa mật khẩu (nên sử dụng bcrypt trong thực tế)
    // const bcrypt = require('bcrypt');
    // const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Thêm người dùng vào cơ sở dữ liệu
    const insertQuery = 'INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)';
    console.log('Executing insert query with values:', fullName, email, password);
    
    db.query(insertQuery, [fullName, email, password], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: "Lỗi đăng ký tài khoản: " + err.message });
      }
      
      console.log('Insert result:', result);
      res.status(201).json({ message: "Đăng ký tài khoản thành công" });
    });
  });
});

// API đăng nhập
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(400).send('Error logging in');
      return;
    }
    if (results.length > 0) {
      // Trả về thông tin người dùng (không bao gồm mật khẩu)
      const user = {
        id: results[0].id,
        fullName: results[0].fullName,
        email: results[0].email
      };
      res.status(200).json(user);
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
