const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Zalopay
const axios = require('axios').default; 
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs');


const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demopod'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/signup', (req, res) => {
    const { userName, userEmail, userPassword, userPhone } = req.body;
    const userRole = 4; // Default role (Customer)
    const sql = 'INSERT INTO User (userName, userEmail, userPassword, userPhone, userRole) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userName, userEmail, userPassword, userPhone, userRole], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Registration failed' });
        }
        res.json({ message: 'User registered successfully' });
    });
});

app.post('/login', (req, res) => {
    const { userEmail, userPassword } = req.body;
    const sql = 'SELECT userId, userName, userEmail, userRole, userPoint FROM User WHERE userEmail = ? AND userPassword = ?';
    db.query(sql, [userEmail, userPassword], (err, results) => {
        if (err) return res.status(500).json({ error: 'Login failed' });
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ userId: user.userId, userEmail: user.userEmail, userRole: user.userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.get('/available-rooms', (req, res) => {
    const sql = `SELECT * FROM Room WHERE roomStatus = 'Available' `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching rooms' });
        res.json(results);
    });
});


app.get('/room-details/:id', (req, res) => {
    const roomId = req.params.id;
    const sql = `SELECT * FROM RoomDetails WHERE roomId = ?`;
    db.query(sql, [roomId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching room details' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(result[0]);
    });
});


// Fetch available slots
app.get('/available-slots/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { date } = req.query;
    const sql = `
        SELECT s.* 
        FROM Slot s
        WHERE s.slotStatus = 'Available' 
        AND s.slotId NOT IN (
            SELECT bs.slotId 
            FROM BookingSlots bs
            JOIN Booking b ON bs.bookingId = b.bookingId
            WHERE b.roomId = ?
            AND bs.bookingStartDay <= ?
            AND bs.bookingEndDay >= ?
        )
        ORDER BY s.slotStartTime
    `;
    db.query(sql, [roomId, date, date], (err, results) => {
        if (err) {
            console.error('Error fetching available slots:', err);
            return res.status(500).json({ error: 'Error fetching slots' });
        }
        res.json(results);
    });
});

// Check room availability
app.get('/available-rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;
    const sql = `
        SELECT * FROM Room
        WHERE roomId = ? 
        AND roomStatus = 'Available'
        AND roomId NOT IN (
            SELECT roomId FROM Booking 
            WHERE (bookingStartDay <= ? AND bookingEndDay >= ?)
            OR (bookingStartDay >= ? AND bookingStartDay <= ?)
            OR (bookingEndDay >= ? AND bookingEndDay <= ?)
        )
    `;
    db.query(sql, [roomId, endDate, startDate, startDate, endDate, startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error checking availability:', err);
            return res.status(500).json({ error: 'Error checking availability' });
        }
        res.json({ available: results.length > 0 });
    });
});

// Fetch services
app.get('/services', (req, res) => {
    const sql = 'SELECT * FROM Services';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching services' });
        res.json(results);
    });
});

// Fetch user points
app.get('/user-points/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT userPoint FROM User WHERE userId = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching user points' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});


//Zalopay

const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

app.post("/payment", async (req, res) => {
    console.log("Received payment request:", req.body);
    const { roomName, totalPrice } = req.body;

    if (!roomName || !totalPrice) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "Missing required fields" });
    }

    const embed_data = {
        redirecturl: "http://localhost:3000/viewbookings"
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // transaction ID
        app_user: "user123",
        app_time: Date.now(), // milliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: totalPrice, // Dynamic total price passed from frontend
        description: `Payment for the room: ${roomName} #${transID}`, // Dynamic room name
        bank_code: "",
        callback_url: "https://c4bc-2402-800-63af-9f15-40bc-894f-bc1a-3981.ngrok-free.app/callback"
    };

    // Generate MAC for the order
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        console.log("Sending request to ZaloPay");
        const result = await axios.post(config.endpoint, null, { params: order });
        console.log("ZaloPay response:", result.data);
        if (result.data && result.data.order_url) {
            res.json({ paymentUrl: result.data.order_url });
        } else {
            console.log("Failed to get order_url from ZaloPay");
            res.status(400).json({ message: "Failed to initiate payment" });
        }
    } catch (error) {
        console.error("Error initiating payment:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: error.message });
    }
});

app.post("/callback", async (req, res) => {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;
  
      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);
  
  
      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      }
      else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
  
        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }
  
    // thông báo kết quả cho ZaloPay server
    res.json(result);
  });

app.post("/status-booking/:app_trans_id", async (req, res) => {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, 
    }
    
    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    
    
    let postConfig = {
        method: 'post',
        url: "https://sb-openapi.zalopay.vn/v2/query",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };
    
    try {
        const result = await axios(postConfig);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error.message);
    }
})


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
