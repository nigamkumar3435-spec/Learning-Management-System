const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const auth = require('./routes/auth');
const courses = require('./routes/courses');
const modules = require('./routes/modules');
const lessons = require('./routes/lessons');
const assignments = require('./routes/assignments');
const submissions = require('./routes/submissions');
const progress = require('./routes/progress');

app.use('/api/v1/auth', auth);
app.use('/api/v1/courses', courses);
app.use('/api/v1/modules', modules);
app.use('/api/v1/lessons', lessons);
app.use('/api/v1/assignments', assignments);
app.use('/api/v1/submissions', submissions);
app.use('/api/v1/progress', progress);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
