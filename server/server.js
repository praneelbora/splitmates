const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const users = require('./routes/v1/users');
const groups = require('./routes/v1/groups');
const friends = require('./routes/v1/friends');
const expenses = require('./routes/v1/expenses');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error(err));

app.use('/api/v1/users', users);
app.use('/api/v1/groups', groups);
app.use('/api/v1/friends', friends);
app.use('/api/v1/expenses', expenses);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));