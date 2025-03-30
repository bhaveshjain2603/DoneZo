import express from 'express';
const api = express.Router()

import { signupUser, loginUser } from '../controllers/User.controllers.js'

api.post('/signup', signupUser);
api.post('/login', loginUser)

export default api