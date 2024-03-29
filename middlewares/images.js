const multer = require('multer')
const sharp = require('sharp')

const storage = multer.memoryStorage()
const upload = multer({ storage })

exports.upload = upload.single('image')

exports.optimize = async (req, res, next) => {
  if (req.file) {
    const { originalname, buffer } = req.file
    let name = originalname.split(' ').join('_')
    name = name.split('.')[0]
    name += Date.now() + '.webp'

    req.file.filename = name

    await sharp(buffer)
      .resize(420, 540, { fit: 'inside' })
      .webp()
      .toFile(`./images/${name}`)
  }

  next()
}


/* var middleware2 = function(param) {
  return function(req, res, next){
    middleware1(req, res, function(){
      // middleware2 code
    });
  }
} */