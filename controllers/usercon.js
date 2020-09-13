const User = require('../models/user').production;
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
var utils = require('../utils/utilfunctions');


exports.test = async (req,res)=>{
    res.send("helllo");
}