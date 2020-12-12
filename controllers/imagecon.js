const Image = require('../models/image').production;
const User = require('../models/user').production;
const fs = require('fs');
const v4 = require('uuid').v4;



const imageDirectory = __dirname.replace("controllers", "images");

const createImageDirIfNotExists = async (user) => {
    return new Promise(resolve => {
        let imageDir = `${imageDirectory}\\${user}`
        fs.access(imageDir, err => {
            if (err) {
                fs.mkdirSync(imageDir);
            }
            resolve();
        });
    });
};

const saveImage = async (b64, format,userId) => {
    await createImageDirIfNotExists(userId);
    const fileName = v4() + `.${format}`;
    fs.writeFile(`${imageDirectory}/${userId}/${fileName}`, b64, { encoding: "base64" }, err => {
        if (err) throw Error(err.toString());
    });
    return fileName;
};

const deleteImage = (fileName,userId) => {
    fs.unlink(`${imageDirectory}/${userId}/${fileName}`, err => {
        if (err) throw Error(err.toString());
    });
};

exports.uploadImages = async (req, res) => {
    try{
        const userId = req.user._id;
        const uploadList = req.body.uploadList;

        //Check if user exist
        let findUser = await User.findById(userId, 'role');
        if (!findUser) return res.status(417).json({message: "The User <"+userId+"> does not exist!"});
        

        for(let data of uploadList){
            let savedFile = await saveImage(data.image,data.format,userId)
            let newImage = new Image({
                userId : userId,
                imageUri : savedFile,
            });
            await newImage.save()
        }
        let findImages = await Image.find({userId:userId}).lean()

        return res.status(200).json({message:'success',images:findImages})

    }catch(error){
        return res.status(417).json({message: "The User could not be safed"});
    }
}

exports.getUserImage = async(req,res) =>{
    try{
        let imageId = req.params.id;

        let findImage = await Image.findById(imageId).lean()
        let findUser = await User.findById(findImage.userId,'avatar').lean()

        return res.status(200).json({message:'success',image:findImage,avatar:findUser.avatar})
    
    }catch(error){
        return res.status(417).json({message: "The User could not be safed"});
    }    
}

exports.deleteImage = async(req,res) =>{
    try{
        const userId = req.user._id;
        const id = req.body.id;
        const fileName = req.body.fileName;

        await Image.findByIdAndDelete(id);

        res.status(204).send();

        try{
            deleteImage(fileName,userId)
        }
        catch(err){
            console.log(error)
        }
    
    }catch(error){
        return res.status(417).json({message: "The User could not be safed"});
    }    
}