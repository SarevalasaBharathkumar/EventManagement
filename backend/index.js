require('dotenv').config(); // Load environment variables
const express = require('express');
const app = express();
const port = 5000;
const mongoDb = require('./db');
const cors = require('cors');
const helmet = require('helmet');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept'
}));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

mongoDb(); // Connect to MongoDB

// Routes
app.use('/api/signup', require('./routes/CreateUser'));
app.use('/api/', require('./routes/LoginUser'));
app.use('/api/events', require('./routes/Events')); 
app.use('/api/feedback', require('./routes/feedbackRouter')); 
app.use('/api/volunteers', require('./routes/volunteerController')); 
app.use('/api/images', require('./routes/PromotionRoutes')); // <-- Add the PromotionRoutes here
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
