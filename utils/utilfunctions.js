const crypto = require('crypto');
// const sharp = require('sharp');
const User = require('../models/user').production;



function encrypt(text){
    var cipher = crypto.createCipher('aes-256-ctr','supersecret')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-ctr','supersecret')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

// async function resizeImage (img,width,height) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (img) {
//                 let imgBuffer = Buffer.from(img, 'base64');
//                 const resizedImage = await sharp(imgBuffer).resize({
//                     width,
//                     height,
//                     fit: sharp.fit.outside,
//                     position: sharp.strategy.attention}).toBuffer()
//                 resolve(resizedImage.toString('base64'))
//             } else {
//                 resolve(img)
//             }
//         } catch (err) {
//             console.log(err);
//             resolve(img)
//         }
//     });   
// }

// function resizeOptimizeImage(b64Image, h, format, quality) {
//   return new Promise(async (resolve, reject) => {
//       try {
//           if (b64Image) {
//               let imgBuffer =  Buffer.from(b64Image, 'base64');
//               sharp(imgBuffer)
//               .resize({ height: h })
//               .toFormat(format, { progressive: true, quality: quality })
//               .toBuffer()
//               .then(data => {
//                   resolve(data.toString('base64'));
//               }).catch(errI => {
//                   return reject(errI);
//               });
//           } else {
//               resolve("");
//           }
//       } catch (err) {
//           return reject(err);
//       }
//   });
// }



module.exports = {
  encrypt,
  decrypt,
//   resizeOptimizeImage,
//   resizeImage,
}