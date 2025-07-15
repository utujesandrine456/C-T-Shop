const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'], // Allowed roles
        default: 'user'         // Default role
      },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
