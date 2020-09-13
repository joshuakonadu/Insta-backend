const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pagination = require('../utils/pagination');
const db_prod = require('../config/db');

const UserSchema = new Schema({
    username: {type: String, lowercase: true, unique: true, trim: true, required: [true,'username has to be filled'], index: true, minlength: [4, 'Username too short (min. 4)'], maxlength: [200, 'Username too long (max. 200)']},
    active: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    role: {type: String, index: true, default: 'user'},
    authentication: [{
        case:{ type: String },
        token:{ type: String },
        expire:{ type: Date },
        created:{ type: Date },
        used: { type: Boolean, default: false }
    }],
    loginAttempts: { type: Number , default: 0},
    loginCount: { type: Number , default: 0},
    penalty: {type: Date, default: undefined},
    userprofile: {
        avatar: {
            format:{ type:String, default:'jpeg'},
            imageB64: {type:String, default:''}
        },
        logo: {
            format:{ type:String, default:'jpeg'},
            imageB64: {type:String, default:''}
        },
        firstName: { 
            type: String, 
            trim: true,
            minlength: [1, 'firstName too short (min. 4)'],
            maxlength: [200, 'firstName too long (max. 200)']
        },
        lastName: { 
            type: String, 
            trim: true,
            minlength: [1, 'lastName too short (min. 4)'],
            maxlength: [200, 'lastName too long (max. 200)']
        },
        notifications: { type: Array},
        settings: { 
            profileCustomTemplates: {type: Array, unique: false, required: false, index: false, default: []},
            feedback: {
                like: { type: Boolean, default: true },
                question: { type: Boolean, default: true },
                dislike: { type: Boolean, default: true },
                opened: { type: Boolean, default: false },
            },
            language: { type: String, default: 'de'},
            autoSave: {type: String, default: ''},
            candidateApproved: {type: Boolean, default: true},
        },
    },
    
}, {timestamps: { createdAt: true, updatedAt: true },collection: 'users'});

UserSchema.plugin(pagination); // adds pagination
UserSchema.set('autoIndex', false);

exports.production = db_prod.model('User', UserSchema);