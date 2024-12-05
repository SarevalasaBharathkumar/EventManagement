const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sarevalasab:MyfirstMongoDbProject@cluster0.cutlj4u.mongodb.net/EventManagement'; // Replace with your MongoDB URI

const mongoDb = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = mongoDb;
