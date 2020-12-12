const User = require('../models/user').production;
const Image = require('../models/image').production
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator/check');

const errorFormatter = ({ location, msg, param,value, nestedErrors }) => {
    return {'param':param,'msg':msg};
  };

exports.registerUser = async (req, res) => {
    try{
        const userParam = req.body;
        //Our Custom Erroformatter
        
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        //Check if User is already in Database
        if (await User.findOne({ username: userParam.username }, 'username', { lean: true })) {
            console.log('Username "' + userParam.username + '" is already taken');
            return res.status(422).json({errors: [{"param":"username","msg":"Es besteht bereits ein Account mit dieser Email-Adresse"}]});
        }
        //Create a new User with Userschema
        const user = new User(userParam);

        //Hash Password with bdcrypt an 12 Saltrounds, state of the art. Argon2 may be more robust, but bcrypt is state of the art
        user.hash = await bcrypt.hash(userParam.password, 12)

        await user.save();
        return res.status(200).json({message: 'Erfolgreich registriert.'});
    } catch (error) {
        return res.status(422).json({errors: [{"param": "", "msg": error.message}]});
    }
}

exports.loginUser = async (req, res) => {
    try{
        const {username, password} = req.body;
        
        //Check if User is in Database
        var user = await User.findOne({ username: username }, 'username hash active role', { lean: true })
        if (!user) {
            console.log('Username "' + username + '" is not found');
            return res.status(422).json({errors: [{"param":"username","msg":"Falsche Email-Adresse oder Passwort"}]});
        }
        
        if (!user.active) {
            return res.status(422).json({errors: [{"param":"username","msg":"Ihr Account ist deaktiviert. Bitte wenden Sie sich an unseren Kundenservice um ihn wieder zu aktivieren"}]});
        }

        const match = await bcrypt.compare(password, user.hash);
            if(!match) {
                return res.status(422).json({errors: [{"param": "", "msg": "Falsche Email-Adresse oder Passwort"}]});   
            }
            
            var token = await jwt.sign({ id:user._id, username:user.username, role:user.role}, 'secretKey');
        
        res.status(200).json({token:token,message: 'Successfully logedin'});
        return await User.findOneAndUpdate({_id :user._id},{ '$set': { 'online': true } })
    }catch(error){
        return res.status(422).json({errors: error.message});
    }
}

exports.getUserData = async (req, res) => {
    try{
        const userId = req.user._id

        var findUser = await User.findById(userId, 'avatar typedName description').lean();
        if (!findUser) return res.status(417).json({message: "The User <"+userId+"> does not exist!"});

        var findImages = await Image.find({userId:userId}).lean()

        return res.status(200).json({message:'success',userData:findUser,images:findImages})
    }catch(error){
        return res.status(422).json({errors: error.message});
    }
}

exports.changeAvatar = async (req,res) =>{
    try{
        const userId = req.user._id;
        const avatar = req.body.avatar;

        var findUser = await User.findById(userId, 'avatar');
        if (!findUser) return res.status(417).json({message: "The User <"+userId+"> does not exist!"});

        findUser.avatar.imageB64 = avatar.image;
        findUser.avatar.format = avatar.format;
    
        await findUser.save();
        return res.status(200).json({message:'success',avatar:findUser.avatar})
    }
    catch(error){
        return res.status(417).json({message: error.message});
    }
}
