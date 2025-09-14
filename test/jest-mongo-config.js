const mongoose = require('mongoose');

module.exports = async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', () => {
        console.log('Connected to test database');
    });
};