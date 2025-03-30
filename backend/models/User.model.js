import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String, 
        required: true,
        trim: true
    },
    userPassword: {
        type: String,
        required: true
    }
})

export default mongoose.model('User', UserSchema);