const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db_prod = require('../config/db');

const UserSchema = new Schema({
    username: {type: String, lowercase: true, unique: true, trim: true, required: [true,'username has to be filled'], index: true, minlength: [4, 'Username too short (min. 4)'], maxlength: [200, 'Username too long (max. 200)']},
    active: { type: Boolean, default: true },
    online: { type: Boolean, default: false },
    role: {type: String, index: true, default: 'user'},
    hash: { type: String, required: false, index: true },
    avatar: {
        format:{ type:String, default:'jpeg'},
        imageB64: {type:String, default:''}
    },
    typedName: {type:String, default:''},
    description: {type:String, default:''},
    notifications: { type: Array},
}, {timestamps: { createdAt: true, updatedAt: true },collection: 'users'});

UserSchema.set('autoIndex', false);

exports.production = db_prod.model('User', UserSchema);