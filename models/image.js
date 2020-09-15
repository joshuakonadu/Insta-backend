const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pagination = require('../utils/pagination');
const db_prod = require('../config/db');

const ImageSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', unique: false, required: false, index: true},
    likes: { type: Array,default:[]},
    image: {
        format:{ type:String, default:'jpeg'},
        imageB64: {type:String, default:''}
    },
    description: {type:String, default:''},
}, {timestamps: { createdAt: true, updatedAt: true },collection: 'images'});

ImageSchema.plugin(pagination); // adds pagination
ImageSchema.set('autoIndex', false);

exports.production = db_prod.model('Image', ImageSchema);