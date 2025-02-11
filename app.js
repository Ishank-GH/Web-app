const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser= require('cookie-parser')
const connectToDb = require('./db/db');
const errorMiddleware = require('./middlewares/error.middleware');
connectToDb();
const userRoutes = require('./routes/user.routes')

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());

app.use(errorMiddleware)



app.use('/users', userRoutes )


module.exports = app;