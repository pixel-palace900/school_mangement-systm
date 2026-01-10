const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const configureCloudinary = require('./config/cloudinary');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const { applyCommonMiddleware } = require('./middleware/applyMiddleware');

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();
// CORS setup allowing custom headers
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // or use your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-data'],
  credentials: true, // if using cookies or auth headers
};
// Add this after your MongoDB connection
console.log('=== Testing Cloudinary Environment Variables ===')
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? 'EXISTS' : 'MISSING')
console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'EXISTS' : 'MISSING') 
console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'EXISTS' : 'MISSING')
console.log('===============================================')

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // <-- Add this after app.use(cors(corsOptions))


// Set port
const PORT = process.env.PORT;


// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev')); // Logging middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Apply common middleware
applyCommonMiddleware(app);

// Import routes
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const parentRoutes = require('./routes/parent');
const attendanceRoutes = require('./routes/attendance');
const classRoutes = require('./routes/class');
const examRoutes = require('./routes/exam');
const feeRoutes = require('./routes/fee');
const notificationRoutes = require('./routes/notification');
const subjectRoutes = require('./routes/subject');
const userRoutes = require('./routes/user');
const gradeRoutes = require('./routes/gradeRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const uploadRoutes = require('./routes/upload');
const profileRoutes = require('./routes/profile');

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the School Management System');
});

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/class', classRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/grade', gradeRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/circular', require('./routes/circular'));
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);

// Test routes (remove in production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test', require('./routes/test-upload'));
}

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Import error handling middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

