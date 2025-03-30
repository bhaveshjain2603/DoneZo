import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import taskRoutes from './routes/Task.routes.js';
import userRoutes from './routes/User.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(
    cors({
      origin: ["http://localhost:5173", "https://sbk-donezo.vercel.app"], // Add your deployed frontend URL here
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // If using cookies/sessions
    })
  );
app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes)
app.use('/api/auth', userRoutes)

mongoose.connect(process.env.MONGO_DB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})