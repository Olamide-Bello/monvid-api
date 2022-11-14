require('dotenv').config ();
const source = process.env.MONGODB_URL;
const mongoose = require('mongoose');
mongoose.connect(source, {
useNewUrlParser: true,
})
