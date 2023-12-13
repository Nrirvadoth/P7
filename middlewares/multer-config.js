const multer = require('multer')
const sharp = require('sharp')

/* const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    let name = file.originalname.split(' ').join('_')
    name = name.split('.')[0]
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
  },
})

module.exports = multer({ storage }).single('image') */


const storage = multer.memoryStorage()
const upload = multer({ storage })

module.exports = (upload.single('image'), async (req, res, next) => {
  console.log(req.file)
  const { originalname, buffer } = req.file
  let name = originalname.split(' ').join('_')
  name = name.split('.')[0]
  name += Date.now() + '.webp'

  await sharp(buffer)
    .resize(420, 540)
    .webp()
    .toFile('./images' + name)
  
  next()
})
