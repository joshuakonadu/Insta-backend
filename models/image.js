const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db_prod = require('../config/db');

const ImageSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', unique: false, required: false, index: true},
    likes: { type: Array,default:[]},
    imageUri: {type:String, default:''},
    private:{type:Boolean, default:true},
    description: {type:String, default:''},
    title: {type:String, default:''},
}, {timestamps: { createdAt: true, updatedAt: true },collection: 'images'});

ImageSchema.set('autoIndex', false);

exports.production = db_prod.model('Image', ImageSchema);