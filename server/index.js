const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

//Zalopay
const axios = require('axios').default;
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs');
const admin = require('firebase-admin');
const imageUpload = multer({ storage: multer.memoryStorage() });



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

// Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(require('./serviceAccountKey.json')), // Path to your service account key
//     storageBucket: 'pod-booking-system-50fd7.appspot.com', // Replace with your bucket name
// });

try {
    const serviceAccount = require('./serviceAccountKey.json');
    // console.log(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'pod-booking-system-50fd7.appspot.com'
    });
    console.log('Firebase Initialized Successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }

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

// ------------------------- CRUD USER -------------------------------------
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





// Fetch user's profile
app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const sql = `
        SELECT userName, userEmail, userPhone, userPoint FROM User WHERE userId = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching profile' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});

// Update user's profile
app.put('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const { userName, userEmail, userPassword, userPhone } = req.body; // Ensure you're receiving the body

    // // Ensure all fields are provided
    // if (!userName || !userEmail || !userPassword || !userPhone) {
    //     return res.status(400).json({ error: 'All fields are required' });
    // }

    const sql = `
        UPDATE User 
        SET userName = ?, userEmail = ?, userPassword = ?, userPhone = ?
        WHERE userId = ?
    `;

    db.query(sql, [userName, userEmail, userPassword, userPhone, userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error updating profile' });
        res.json({ message: 'Profile updated successfully' });
    });
});


// Delete user
app.delete('/profile/:id', (req, res) => {
    const userId = req.params.id;

    // Delete query
    const sql = `
        DELETE FROM User WHERE userId = ?
    `;
    
    // Execute the query
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error deleting user' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
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


// ---------------------------- CRUD SLOT -------------------------------------
// Fetch available slots (for user)
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

//For manage 

// Create a new slot
app.post('/slots', (req, res) => {
    const { slotStartTime, slotEndTime, slotStatus } = req.body;

    // Validate required fields
    if (!slotStartTime || !slotEndTime || !slotStatus) {
        return res.status(400).json({ error: 'slotStartTime, slotEndTime, and slotStatus are required' });
    }

    const sql = `
        INSERT INTO Slot (slotStartTime, slotEndTime, slotStatus) 
        VALUES (?, ?, ?)
    `;

    db.query(sql, [slotStartTime, slotEndTime, slotStatus], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error creating slot' });
        res.status(201).json({ message: 'Slot created successfully', slotId: results.insertId });
    });
});

// Update a slot
app.put('/slots/:slotId', (req, res) => {
    const slotId = req.params.slotId;
    const { slotStartTime, slotEndTime, slotStatus } = req.body;

    // Validate required fields
    if (!slotStartTime || !slotEndTime || !slotStatus) {
        return res.status(400).json({ error: 'slotStartTime, slotEndTime, and slotStatus are required' });
    }

    const sql = `
        UPDATE Slot 
        SET slotStartTime = ?, slotEndTime = ?, slotStatus = ? 
        WHERE slotId = ?
    `;

    db.query(sql, [slotStartTime, slotEndTime, slotStatus, slotId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error updating slot' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Slot not found' });
        res.json({ message: 'Slot updated successfully' });
    });
});

// Delete a slot
app.delete('/slots/:slotId', (req, res) => {
    const slotId = req.params.slotId;

    const sql = `
        DELETE FROM Slot WHERE slotId = ?
    `;

    db.query(sql, [slotId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error deleting slot' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Slot not found' });
        res.json({ message: 'Slot deleted successfully' });
    });
});


// Fetch all slots
app.get('/slots', (req, res) => {
    const sql = 'SELECT * FROM Slot';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching slots' });
        res.json(results);
    });
});


// --------------------------------- CRUD SERVICES ---------------

// Fetch services
app.get('/services', (req, res) => {
    const sql = 'SELECT * FROM Services';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching services' });
        res.json(results);
    });
});
//For manage
// Create a new service
app.post('/services', (req, res) => {
    const { serviceName, serviceDescription, servicePrice, serviceStatus } = req.body;

    // Validate required fields
    if (!serviceName || !servicePrice || !serviceStatus) {
        return res.status(400).json({ error: 'serviceName, servicePrice, and serviceStatus are required' });
    }

    const sql = `
        INSERT INTO Services (serviceName, serviceDescription, servicePrice, serviceStatus) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [serviceName, serviceDescription, servicePrice, serviceStatus], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error creating service' });
        res.status(201).json({ message: 'Service created successfully', serviceId: results.insertId });
    });
});

// Update a service
app.put('/services/:serviceId', (req, res) => {
    const serviceId = req.params.serviceId;
    const { serviceName, serviceDescription, servicePrice, serviceStatus } = req.body;

    // Validate required fields
    if (!serviceName || !servicePrice || !serviceStatus) {
        return res.status(400).json({ error: 'serviceName, servicePrice, and serviceStatus are required' });
    }

    const sql = `
        UPDATE Services 
        SET serviceName = ?, serviceDescription = ?, servicePrice = ?, serviceStatus = ? 
        WHERE serviceId = ?
    `;

    db.query(sql, [serviceName, serviceDescription, servicePrice, serviceStatus, serviceId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error updating service' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service updated successfully' });
    });
});

// Delete a service
app.delete('/services/:serviceId', (req, res) => {
    const serviceId = req.params.serviceId;

    const sql = `
        DELETE FROM Services WHERE serviceId = ?
    `;

    db.query(sql, [serviceId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error deleting service' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service deleted successfully' });
    });
});


// ----------------------------------------------------------- CRUD IMAGES AND ROOMS -------------------------------------------------
// Setup Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Endpoint to upload image
app.post('/upload-image/:roomId', upload.single('image'), (req, res) => {
    const roomId = req.params.roomId;
    const { imageUrl } = req.body;

    const query = `INSERT INTO RoomImages (roomId, imageUrl) VALUES (?, ?)`;
    db.execute(query, [roomId, imageUrl], (err, result) => {
        if (err) {
            return res.status(500).send('Error uploading image');
        }
        res.status(200).send('Image uploaded successfully');
    });
});


//GET room details with images
app.get('/room-details/:id', (req, res) => {
    const roomId = req.params.id;

    // SQL query to fetch room details and corresponding image URLs
    const sql = `
        SELECT Room.*, GROUP_CONCAT(RoomImages.imageUrl) AS images
        FROM Room
        LEFT JOIN RoomImages ON Room.roomId = RoomImages.roomId
        WHERE Room.roomId = ?
        GROUP BY Room.roomId
    `;

    db.query(sql, [roomId], (err, result) => {
        if (err) {
            console.error('Error fetching room details:', err);
            return res.status(500).json({ error: 'Error fetching room details' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Parse image URLs as an array
        const room = result[0];
        room.images = room.images ? room.images.split(',') : [];

        res.json(room);
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

// Fetch all room with images
app.get('/available-rooms', (req, res) => {
    const query = `
        SELECT r.*, ri.imageUrl
        FROM Room r
        LEFT JOIN RoomImages ri ON r.roomId = ri.roomId
        WHERE r.roomStatus = 'Available'
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching available rooms:', err);
            return res.status(500).send('Error fetching rooms');
        }
        // console.log("Query Result:", result); // Debugging line to check the result

        // Transform the results to group image URLs for each room
        const roomsWithImages = result.reduce((acc, room) => {
            const { imageUrl, ...roomData } = room;
            const roomId = room.roomId;

            // If room doesn't exist in accumulator, create it
            if (!acc[roomId]) {
                acc[roomId] = { ...roomData, imageUrls: [] };
            }
            // Add image URL if it exists
            if (imageUrl) {
                acc[roomId].imageUrls.push(imageUrl);
            }

            return acc;
        }, {});

        res.json(Object.values(roomsWithImages));
    });
});



// GET /rooms/:id: Fetch room details by roomId
app.get('/rooms/:id', (req, res) => {
    const roomId = req.params.id;
    const sql = `
        SELECT Room.roomId, Room.roomName, Room.roomType, Room.roomDescription, 
               Room.roomDetailsDescription, Room.roomPricePerSlot, Room.roomPricePerDay, 
               Room.roomPricePerWeek, Room.roomStatus, Room.createdAt, RoomImages.imageUrl
        FROM Room
        LEFT JOIN RoomImages ON Room.roomId = RoomImages.roomId
        WHERE Room.roomId = ?
    `;

    db.query(sql, [roomId], (err, result) => {
        if (err) {
            console.error('Error fetching room details:', err);
            return res.status(500).send('Failed to fetch room details');
        }

        // Ensure there is room data available
        if (result.length === 0) {
            return res.status(404).send('Room not found');
        }

        // Group images if necessary
        const room = {
            roomId: result[0].roomId,
            roomName: result[0].roomName,
            roomType: result[0].roomType,
            roomDescription: result[0].roomDescription,
            roomDetailsDescription: result[0].roomDetailsDescription,
            roomPricePerSlot: result[0].roomPricePerSlot,
            roomPricePerDay: result[0].roomPricePerDay,
            roomPricePerWeek: result[0].roomPricePerWeek,
            roomStatus: result[0].roomStatus,
            createdAt: result[0].createdAt,
            images: result.map(row => row.imageUrl).filter(url => url) // Collect only valid image URLs
        };

        res.json(room);
    });
});



// GET /rooms: Fetch the list of all rooms and their images
app.get('/rooms', (req, res) => {
    const sql = `
        SELECT Room.roomId, Room.roomName, Room.roomType, Room.roomDescription, 
               Room.roomDetailsDescription, Room.roomPricePerSlot, Room.roomPricePerDay, 
               Room.roomPricePerWeek, Room.roomStatus, Room.createdAt, RoomImages.imageUrl
        FROM Room
        LEFT JOIN RoomImages ON Room.roomId = RoomImages.roomId
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).send('Failed to fetch rooms');
        }

        // Group images by roomId
        const rooms = {};
        result.forEach(row => {
            if (!rooms[row.roomId]) {
                rooms[row.roomId] = {
                    roomId: row.roomId,
                    roomName: row.roomName,
                    roomType: row.roomType,
                    roomDescription: row.roomDescription,
                    roomDetailsDescription: row.roomDetailsDescription,
                    roomPricePerSlot: row.roomPricePerSlot,
                    roomPricePerDay: row.roomPricePerDay,
                    roomPricePerWeek: row.roomPricePerWeek,
                    roomStatus: row.roomStatus,
                    createdAt: row.createdAt,
                    images: [],
                };
            }
            if (row.imageUrl) {
                rooms[row.roomId].images.push(row.imageUrl);
            }
        });

        res.json(Object.values(rooms));
    });
});


// POST /rooms: Create a new room with image upload to Firebase Storage
app.post('/rooms', upload.single('roomImage'), async (req, res) => {
    const { roomName, roomType, roomDescription, roomDetailsDescription, roomPricePerSlot, roomPricePerDay, roomPricePerWeek, roomStatus } = req.body;
    let imageUrl = null;

    if (req.file && req.file.buffer) {
        const bucket = admin.storage().bucket();
        const fileName = `${Date.now()}_${req.file.originalname}`; // Use a unique name for the file
        const file = bucket.file(fileName);

        try {
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                }
            });

            // Make the file publicly accessible
            await file.makePublic();

            // Get the public URL
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } catch (error) {
            console.error('Error uploading file to Firebase:', error);
            return res.status(500).json({ error: 'Failed to upload image to Firebase', details: error.message });
        }
    } else if (req.file) {
        console.error('File received but buffer is undefined');
        return res.status(400).json({ error: 'Invalid file data received' });
    }

    // Insert Room data into Room table
    const sqlRoom = `INSERT INTO Room (roomName, roomType, roomDescription, roomDetailsDescription, roomPricePerSlot, roomPricePerDay, roomPricePerWeek, roomStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sqlRoom, [roomName, roomType, roomDescription, roomDetailsDescription, roomPricePerSlot, roomPricePerDay, roomPricePerWeek, roomStatus], (err, result) => {
        if (err) {
            console.error('Error inserting room:', err);
            return res.status(500).send('Failed to create room');
        }

        const roomId = result.insertId; // Get the new roomId

        // Insert image URL into RoomImages table if an image was uploaded
        if (imageUrl) {
            const sqlImage = `INSERT INTO RoomImages (roomId, imageUrl) VALUES (?, ?)`;
            db.query(sqlImage, [roomId, imageUrl], (err) => {
                if (err) {
                    console.error('Error inserting image URL:', err);
                    return res.status(500).send('Failed to upload image URL');
                }
            });
        }

        res.json({ message: 'Room created successfully', roomId });
    });
});

// PUT /rooms/:roomId: Update an existing room
app.put('/rooms/:roomId', upload.single('roomImage'), async (req, res) => {
    const roomId = req.params.roomId;
    const { roomName, roomType, roomDescription, roomDetailsDescription, roomPricePerSlot, roomPricePerDay, roomPricePerWeek, roomStatus } = req.body;

    let imageUrl = null;

    if (req.file && req.file.buffer) {
        const bucket = admin.storage().bucket();
        const fileName = `${Date.now()}_${req.file.originalname}`; // Use a unique name for the file
        const file = bucket.file(fileName);

        try {
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                }
            });

            // Make the file publicly accessible
            await file.makePublic();

            // Get the public URL
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } catch (error) {
            console.error('Error uploading file to Firebase:', error);
            return res.status(500).json({ error: 'Failed to upload image to Firebase', details: error.message });
        }
    } else if (req.file) {
        console.error('File received but buffer is undefined');
        return res.status(400).json({ error: 'Invalid file data received' });
    }

    // Update Room data
    const sqlRoom = `UPDATE Room SET roomName = ?, roomType = ?, roomDescription = ?, roomDetailsDescription = ?, roomPricePerSlot = ?, roomPricePerDay = ?, roomPricePerWeek = ?, roomStatus = ? WHERE roomId = ?`;
    db.query(sqlRoom, [roomName, roomType, roomDescription, roomDetailsDescription, roomPricePerSlot, roomPricePerDay, roomPricePerWeek, roomStatus, roomId], (err) => {
        if (err) {
            console.error('Error updating room:', err);
            return res.status(500).send('Failed to update room');
        }

        // Update image URL in RoomImages table if an image was uploaded
        if (imageUrl) {
            const sqlImage = `INSERT INTO RoomImages (roomId, imageUrl) VALUES (?, ?)`;
            db.query(sqlImage, [roomId, imageUrl], (err) => {
                if (err) {
                    console.error('Error inserting image URL:', err);
                    return res.status(500).send('Failed to upload image URL');
                }
            });
        }

        res.json({ message: 'Room updated successfully' });
    });
});

// DELETE /rooms/:roomId: Delete a room
app.delete('/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    const sql = 'DELETE FROM Room WHERE roomId = ?';

    db.query(sql, [roomId], (err, result) => {
        if (err) {
            console.error('Error deleting room:', err);
            return res.status(500).send('Failed to delete room');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Room not found');
        }
        res.json({ message: 'Room deleted successfully' });
    });
});




// ------------------------------------------------------------ Zalopay -------------------------------------------------------------

const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

// app.post("/payment", async (req, res) => {
//     console.log("Received payment request:", req.body);
//     const { roomName, totalPrice } = req.body;

//     if (!roomName || !totalPrice) {
//         console.log("Missing required fields");
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     const embed_data = {
//         redirecturl: "http://localhost:3000/viewbookings"
//     };

//     const items = [{}];
//     const transID = Math.floor(Math.random() * 1000000);
//     const order = {
//         app_id: config.app_id,
//         app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // transaction ID
//         app_user: "user123",
//         app_time: Date.now(), // milliseconds
//         item: JSON.stringify(items),
//         embed_data: JSON.stringify(embed_data),
//         amount: totalPrice, // Dynamic total price passed from frontend
//         description: `Payment for the room: ${roomName} #${transID}`, // Dynamic room name
//         bank_code: "",
//         callback_url: "https://d613-2402-800-63af-9f15-8c6e-1328-4e65-d8f2.ngrok-free.app/callback"
//     };

//     // Generate MAC for the order
//     const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
//     order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//     try {
//         console.log("Sending request to ZaloPay");
//         const result = await axios.post(config.endpoint, null, { params: order });
//         console.log("ZaloPay response:", result.data);
//         if (result.data && result.data.order_url) {
//             res.json({ paymentUrl: result.data.order_url });
//         } else {
//             console.log("Failed to get order_url from ZaloPay");
//             res.status(400).json({ message: "Failed to initiate payment" });
//         }
//     } catch (error) {
//         console.error("Error initiating payment:", error.response ? error.response.data : error.message);
//         res.status(500).json({ message: error.message });
//     }
// });


// //Update Booking, Payment, Transaction table if payment successful
// app.post("/callback", async (req, res) => {
//     let result = {};

//     try {
//         let dataStr = req.body.data;
//         let reqMac = req.body.mac;

//         let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
//         console.log("mac =", mac);


//         // kiểm tra callback hợp lệ (đến từ ZaloPay server)
//         if (reqMac !== mac) {
//             // callback không hợp lệ
//             result.return_code = -1;
//             result.return_message = "mac not equal";
//         }
//         else {
//             // thanh toán thành công
//             // merchant cập nhật trạng thái cho đơn hàng
//             let dataJson = JSON.parse(dataStr, config.key2);
//             console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

//             result.return_code = 1;
//             result.return_message = "success";
//         }
//     } catch (ex) {
//         result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
//         result.return_message = ex.message;
//     }

//     // thông báo kết quả cho ZaloPay server
//     res.json(result);
// });

// app.post("/status-booking/:app_trans_id", async (req, res) => {
//     const app_trans_id = req.params.app_trans_id;
//     let postData = {
//         app_id: config.app_id,
//         app_trans_id: app_trans_id,
//     }

//     let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
//     postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


//     let postConfig = {
//         method: 'post',
//         url: "https://sb-openapi.zalopay.vn/v2/query",
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: qs.stringify(postData)
//     };

//     try {
//         const result = await axios(postConfig);
//         return res.status(200).json(result.data);
//     } catch (error) {
//         console.log(error.message);
//     }
// })

// Update Booking, Payment, Transaction tables if payment successful

app.post("/payment", async (req, res) => {
    console.log("Received payment request:", req.body);

    const { roomName, roomId, totalPrice, userId, bookingType, selectedSlots, selectedDate, selectedServices, bookingStartDay, bookingEndDay, methodId, discount } = req.body;

    // Check for required fields based on booking type
    if (!roomName || !roomId || !totalPrice || !userId || !methodId || 
            (bookingType === 'range' && (!bookingStartDay || !bookingEndDay)) || 
            (bookingType === 'slot' && (!selectedSlots || selectedSlots.length === 0))) {
        console.log("Missing required fields");
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle cases where 'selectedDate' is missing for slot bookings
    if (bookingType === 'slot') {
        if (!selectedDate) {
            console.log("Missing selectedDate for slot booking");
            return res.status(400).json({ message: "Missing selectedDate for slot booking" });
        }
    }
    if (bookingType === 'range' && (!bookingStartDay || !bookingEndDay)) {
        console.log("Missing required fields for date range booking");
        return res.status(400).json({ message: "Missing required fields for date range booking" });
    }
    

    // Log each value to check if any are missing
    console.log("roomName:", roomName);
    console.log("roomId:", roomId);
    console.log("totalPrice:", totalPrice);
    console.log("userId:", userId);
    console.log("bookingType:", bookingType);
    console.log("Services:", selectedServices);
    console.log("selectedSlots:", selectedSlots);
    console.log("selectedDate:", selectedDate);
    console.log("bookingStartDay:", bookingStartDay);
    console.log("bookingEndDay:", bookingEndDay);
    console.log("discount:", discount);
    console.log("methodId:", methodId);


    // Define embedded data and payment details
    const embed_data = {
        selectedDate,
        selectedServices,
        bookingStartDay,  
        bookingEndDay,    
        discount,
        redirecturl: "http://localhost:3000/viewbookings"
    };

    // Handle items for slot or date range bookings
    const items = bookingType === 'slot' 
    ? selectedSlots.map(slot => ({
        name: roomName,
        roomId: roomId,
        bookingType: bookingType,
        bookingStartDay: selectedDate, // Use 'selectedDate' for slot bookings
        bookingEndDay: selectedDate,   // Same as 'bookingStartDay' for slots
        slotId: slot.slotId,
        slotStartTime: slot.slotStartTime,
        slotEndTime: slot.slotEndTime
    }))
    : [{
        name: roomName,
        roomId: roomId,
        bookingType: bookingType,
        bookingStartDay: bookingStartDay,
        bookingEndDay: bookingEndDay
    }];

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: userId, // Using actual userId
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: totalPrice,
        description: `Payment for the room: ${roomName}, Transaction #${transID}`,
        bank_code: methodId, // Pass methodId as bank_code or as part of other metadata
        callback_url: "https://a14d-2402-800-63af-9f15-546e-be33-3a62-eacf.ngrok-free.app/callback",
        selectedDate
    };

    // Generate MAC for the order
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        console.log("Sending request to ZaloPay");
        const result = await axios.post(config.endpoint, null, { params: order });

        console.log("ZaloPay response:", result.data);

        // Check for the correct response and return the payment URL
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
        // Parse incoming data
        const dataStr = req.body.data;
        const reqMac = req.body.mac;

        // Generate MAC from the received data and compare with the received MAC
        const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
            return res.json(result);
        }

        // Parse the JSON data from the payment system
        const dataJson = JSON.parse(dataStr);
        const embedData = JSON.parse(dataJson.embed_data);
        const selectedDate = embedData.selectedDate;
        const selectedServices = embedData.selectedServices || []; // Extract services
        console.log("selectedDate in callback:", selectedDate);
        console.log("Received dataJson:", dataJson);
        const discount = embedData.discount || false;
        const userId = dataJson.app_user; // User identifier
        const totalPrice = dataJson.amount;
        const paymentMethodId = dataJson.paymentMethodId || 1; // Method ID passed from frontend (defaults to 1)

        console.log("Processing payment for userId:", userId);

        // Extract item array from item string
        const items = JSON.parse(dataJson.item); // Parse the item data

        let bookingId; // Declare bookingId in the outer scope
        
        for (const item of items) {
            const { roomId, bookingType, slotId, slotStartTime, slotEndTime } = item;
            const bookingStartDay = selectedDate;
            const bookingEndDay = selectedDate;

            if (bookingType === "slot") {
                console.log(`Processing slot booking for roomId: ${roomId}, slotId: ${slotId}`);

                // Insert into Booking table for slot booking
                const bookingQuery = `
                    INSERT INTO Booking (userId, roomId, bookingStartDay, bookingEndDay, totalPrice, bookingStatus)
                    VALUES (?, ?, ?, ?, ?, 'Confirmed')
                `;
                const [bookingResult] = await db.promise().query(bookingQuery, [userId, roomId, bookingStartDay, bookingEndDay, totalPrice]);

                bookingId = bookingResult.insertId; // Assign the bookingId here
                console.log("Slot Booking inserted with ID:", bookingId);

                // Insert into BookingSlots table
                const bookingSlotsQuery = `
                    INSERT INTO BookingSlots (bookingId, slotId, bookingStartDay, bookingEndDay)
                    VALUES (?, ?, ?, ?)
                `;
                await db.promise().query(bookingSlotsQuery, [bookingId, slotId, bookingStartDay, bookingEndDay]);
                console.log("Inserted into BookingSlots");

            } else if (bookingType === "range") {
                const bookingStartDay = embedData.bookingStartDay;
                const bookingEndDay = embedData.bookingEndDay;
                console.log(`Processing date booking for roomId: ${roomId}, start: ${bookingStartDay}, end: ${bookingEndDay}`);

                // Insert into Booking table for date booking
                const bookingQuery = `
                    INSERT INTO Booking (userId, roomId, bookingStartDay, bookingEndDay, totalPrice, bookingStatus)
                    VALUES (?, ?, ?, ?, ?, 'Confirmed')
                `;
                const [bookingResult] = await db.promise().query(bookingQuery, [userId, roomId, bookingStartDay, bookingEndDay, totalPrice]);

                bookingId = bookingResult.insertId; // Assign the bookingId here
                console.log("Date Booking inserted with ID:", bookingId);
            }
        }

        // Now use bookingId for Payment and Transaction insertions
        if (bookingId) {
            // Insert into BookingServices table only if there are services selected
            if (selectedServices.length > 0) {
                const servicesQuery = `
                    INSERT INTO BookingServices (bookingId, serviceId, servicePrice)
                    VALUES (?, ?, ?)
                `;
                for (const service of selectedServices) {
                    const { serviceId, servicePrice } = service; // Extract serviceId and servicePrice
                    await db.promise().query(servicesQuery, [bookingId, serviceId, servicePrice]);
                    console.log("Inserted service into BookingServices");
                }
            }

            // Insert into Payment table with the methodId
            const paymentQuery = `
                INSERT INTO Payment (bookingId, methodId, totalPrice, paymentStatus)
                VALUES (?, ?, ?, 'Completed')
            `;
            await db.promise().query(paymentQuery, [bookingId, paymentMethodId, totalPrice]);
            console.log("Inserted into Payment");

            // Insert into Transaction table
            const transactionQuery = `
                INSERT INTO Transaction (bookingId, userId, eventDescription, transactionType, transactionAmount, transactionStatus)
                VALUES (?, ?, ?, 'Payment', ?, 'Success')
            `;
            const eventDescription = `Payment for booking ID: ${bookingId}`;
            await db.promise().query(transactionQuery, [bookingId, userId, eventDescription, totalPrice]);
            console.log("Inserted into Transaction");


            // Update User Points by subtracting discount
            const updateUserPointsQuery = `
                UPDATE User
                SET userPoint = userPoint - ?
                WHERE userId = ?
            `;
            if (discount) {
                await db.promise().query(updateUserPointsQuery, [discount, userId]);
                console.log(`User points updated for userId: ${userId}, discount applied: ${discount}`);
            }

        } else {
            throw new Error("Booking ID is undefined, could not process payment.");
        }

        // Return success result
        result.return_code = 1;
        result.return_message = "success";
    } catch (ex) {
        console.error("Error during callback handling:", ex);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    // Send the response to the payment system
    res.json(result);
});







app.post("/status-booking/:app_trans_id", async (req, res) => {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id,
    };

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
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});