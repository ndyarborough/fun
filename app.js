const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT;

// Initialize Express app
const app = express();

mongoose.connect(process.env.DBClusterString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(res => {
  console.log('Database connected')
  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  })
}
).catch(err => console.log(err));

//enable cors
app.use(cors('*'));

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// User routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/messages', messageRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);

    // Noah Was Here


