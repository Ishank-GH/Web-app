const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser= require('cookie-parser')
const connectToDb = require('./db/db');
const errorMiddleware = require('./middlewares/error.middleware');
const fs = require('fs');
const path = require('path');

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

connectToDb();
const userRoutes = require('./routes/user.routes')
const questionRoutes = require('./routes/question.routes')
const answerRoutes = require('./routes/answer.routes')
const contactsRoutes = require('./routes/contacts.routes')
const messageRoutes = require('./routes/message.routes')
const communityRoutes = require('./routes/community.routes');
const channelRoutes = require('./routes/channel.routes');


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());


app.use('/users', userRoutes )
app.use('/questions', questionRoutes)
app.use('/questions', answerRoutes)
app.use('/contacts', contactsRoutes)
app.use('/messages', messageRoutes)
app.use('/communities', communityRoutes);
app.use('/channels', channelRoutes);

app.use(errorMiddleware)

module.exports = app;